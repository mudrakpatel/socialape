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
import ChatIcon from '@material-ui/icons/Chat';
import UnfoldMore from '@material-ui/icons/UnfoldMore';
//Redux imports
import {connect} from 'react-redux';
//Component imports
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';
//Utilities ('util' folder) imports
import CustomTooltipButton from '../../util/CustomTooltipButton';
//Action imports
import {getScream, clearErrors} from '../../redux/actions/dataActions';
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
    expandButton: {
        position: 'absolute',
        left: '90%'
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50,
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
        const {clearErrors} = this.props;
        this.setState({open: false});
        clearErrors();
    };

    render(){
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
                comments,
            },
            UI: {
                loading,
            },
        } = this.props;
        const {open} = this.state;
        //Dialog markup
        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress 
                    size={200}
                    thickness={2}
                />
            </div>
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
                            <LikeButton screamId={screamId}/>
                            <span>
                                {likeCount} likes
                            </span>
                            <CustomTooltipButton tip="Comments">
                                <ChatIcon color="primary" />
                            </CustomTooltipButton>
                            <span>
                                {commentCount} comments
                            </span>
                    </Grid>
                    <hr 
                        className={classes.visibleSeparator}
                    />
                    <CommentForm screamId={screamId}/>
                    <Comments 
                        comments={comments}
                    />
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
    clearErrors: PropTypes.func.isRequired,
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
    clearErrors,
};


export default connect(
    mapStateToProps,
    mapActionsToProps,
)(withStyles(styles)(ScreamDialog));