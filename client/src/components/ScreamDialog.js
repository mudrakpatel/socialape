import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import dayjs from 'dayjs'; //For date formatting
//MUI (Material UI) imports
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
//MUI (Material UI) icons imports
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
//Redux imports
import {connect} from 'react-redux';
//Utilities ('util' folder) imports
import CustomTooltipButton from '../util/CustomTooltipButton';
//Action imports
import {getScream} from '../redux/actions/dataActions';
import Paper from '@material-ui/core/Paper';

const PaperComponent = (props) => {
    return(
        <Draggable
            handle="#draggable">
                <Paper {...props}/>
        </Draggable>
    );
};

const styles = (theme) => ({
    ...theme.spreadThis,
    invisibleSeparator: {
        border: 'none',
        margin: 4,
    },
    profileImage: {
        top: '5%',
        maxWidth: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover',
    },
    dialogContent: {
        padding: 20,
    },
});

class ScreamDialog extends Component{
    state = {
        open: false,
    };

    handleOpen = () => {
        const {getScream, screamId} = this.props;
        this.setState({open: true});
        getScream(screamId);
    };

    handleClose = () => {
        this.setState({open: false});
    };

    render(){
        console.log(this.props);
        const {
            classes,
            scream: {
                screamId,
                body,
                createdAt,
                likeCount,
                commentCount,
                userImage,
                userHandle,
            },
            UI: {
                loading,
            },
        } = this.props;
        const {open} = this.state;
        //Dialog markup
        const dialogMarkup = loading ? (
            <CircularProgress size={200}/>
        ) : (
            <Grid
                container
                spacing={16}>
                    <Grid
                        item
                        sm={5}>
                            <img 
                                src={userImage}
                                alt="Profile picture"
                                className={classes.profileImage}
                            />
                    </Grid>
                    <Grid
                        item
                        sm={7}>
                            <Typography
                                variant="h5"
                                color="primary"
                                component={Link}
                                to={`/users/${userHandle}`}>
                                    @{userHandle}
                            </Typography>
                            <hr 
                                className={classes.invisibleSeparator}
                            />
                            <Typography
                                variant="body2"
                                color="textSecondary">
                                    {dayjs(createdAt).format('h:mm a, DD MMMM YYYY')}
                            </Typography>
                            <hr
                                className={classes.invisibleSeparator}
                            />
                            <Typography
                                variant="body1">
                                    {body}
                            </Typography>
                    </Grid>
            </Grid>
        );
        return(
            <Fragment>
                <CustomTooltipButton 
                    tip="Expand Scream" 
                    onClick={this.handleOpen} 
                    tipClassName={classes.expandButton}>
                        <UnfoldMore color="primary"/>
                </CustomTooltipButton>
                <Dialog
                    fullWidth
                    open={open}
                    maxWidth="sm"
                    onClose={this.handleClose}
                    aria-labelledby="draggable"
                    PaperComponent={PaperComponent}>
                        <CustomTooltipButton
                            tip="Close"
                            onClick={this.handleClose}
                            tipClassName={classes.closeButton}>
                                <CloseIcon/>
                        </CustomTooltipButton>
                        <DialogTitle
                            id="draggable"
                            style={{cursor: 'move'}}>
                                Scream by {userHandle}
                        </DialogTitle>
                        <DialogContent 
                            className={classes.dialogContent}>
                                {dialogMarkup}
                        </DialogContent>
                </Dialog>
            </Fragment>
        );
    };
};

ScreamDialog.propTypes = {
    getScream: PropTypes.func.isRequired,
    screamId: PropTypes.string.isRequired,
    userHandle: PropTypes.string.isRequired,
    scream: PropTypes.object.isRequired,
    UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    scream: state.data.scream,
    UI: state.UI,
});

const mapActionsToProps = {
    getScream,
};


export default connect(
    mapStateToProps,
    mapActionsToProps,
)(withStyles(styles)(ScreamDialog));