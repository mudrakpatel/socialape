import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
//Redux imports
import {connect} from 'react-redux';
//Action imports
import {markNotificationsRead} from '../../redux/actions/userActions';
//MUI (Material UI) imports
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
//Icon imports
import NotificationsIcon from '@material-ui/icons/Notifications';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';

class Notifications extends Component{
    state = {
        anchorElement: null,
    };

    handleOpen = (event) => {
        this.setState({
            anchorElement: event.target,
        });
    };

    handleClose = () => {
        this.setState({
            anchorElement: null,
        });
    };

    onMenuOpened = () => {
        const {markNotificationsRead} = this.props;
        let unreadNotificationsIds = this.props.notifications.filter(
            (notification) => !notification.read
        ).map((notification) => notification.notificationId);
        markNotificationsRead(unreadNotificationsIds);
    };

    render(){
        const {notifications} = this.props;
        const {anchorElement} = this.state;
        dayjs.extend(relativeTime);
        let notificationsIcon;
        if(notifications && notifications.length > 0){
            notifications.filter(
                (notification) => notification.read === false).length ? (notificationsIcon = (
                    <Badge badgeContent={
                                notifications.filter((notification) => notification.read === false).length
                            } color="secondary">
                                <NotificationsIcon/>
                    </Badge>
                )) : (
                    notificationsIcon = <NotificationsIcon/>
                );
        } else {
             notificationsIcon = < NotificationsIcon/>
        }
        let notificationsMarkup = notifications && notifications.length > 0 ? (
            notifications.map((notification) => {
                const verb = notification.type === 'like' ? 'liked' : 'commented on';
                const time = dayjs(notification.createdAt).fromNow();
                const iconColor = notification.read ? 'primary' : 'secondary';
                const icon = notification.type === 'like' ? (
                    <FavoriteIcon color={iconColor} style={{marginRight: 10}}/>
                ) : (
                    <ChatIcon color={iconColor} style={{marginRight: 10}}/>
                );
                return(
                    <MenuItem key={notification.createdAt} onClick={this.handleClose}>
                        {icon}
                        <Typography component={Link} color="default" variant="body1" 
                            to={`/users/${notification.recipient}/scream/${notification.screamId}`}>
                                {notification.sender} {verb} your scream {time}
                        </Typography>
                    </MenuItem>
                );
            })
        ) : (
            <MenuItem onClick={this.handleClose}>
                No notifications yet
            </MenuItem>
        );
        return(
            <Fragment>
                <Tooltip placement="top" title="Notifications">
                    <IconButton aria-owns={
                            anchorElement ? 'simple-menu' : undefined
                        } aria-haspopup="true" onClick={this.handleOpen}>
                            {notificationsIcon}
                    </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorElement} open={Boolean(anchorElement)} 
                    onClose={this.handleClose} onEntered={this.onMenuOpened}>
                        {notificationsMarkup}
                </Menu>
            </Fragment>
        );
    }
}

Notifications.propTypes = {
    markNotificationsRead: PropTypes.func.isRequired,
    notifications: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
    notifications: state.user.notifications,
});

const mapActionsToProps = {
    markNotificationsRead,
};

export default connect(
    mapStateToProps,
    mapActionsToProps,
)(Notifications);