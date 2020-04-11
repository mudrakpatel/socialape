import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import dayjs from 'dayjs';
//Redux imports
import {connect} from 'react-redux';
//Utilities ('Util' folder) imports
import CustomTooltipButtom from '../../util/CustomTooltipButton';
//MUI (Material UI) imports
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
//Icon imports
import DeleteIcon from '@material-ui/icons/DeleteOutline';
//Action imports
import {
    getCommentsForScream,
    deleteComment,
} from '../../redux/actions/dataActions';

const styles = (theme) => ({
    ...theme.spreadThis,
    commentImage: {
        maxWidth: '100%',
        height: 100,
        objectFit: 'cover',
        borderRadius: '50%',
    },
    commentData: {
        marginLeft: 20,
    },
    grid2: {
        position: 'relative',
    },
    deleteButton: {
        top: '-16%',
        left: '90%',
        position: 'absolute'
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50,
    },
});

class Comments extends Component{

    componentDidMount(){
        const {
            screamId, 
            getCommentsForScream,
        } = this.props;
        getCommentsForScream(screamId);
    }

    handleDeleteButtonClick = (commentId) => {
        const {
            deleteComment,
        } = this.props;
        deleteComment(commentId);
    };

    render(){
        const {
            authenticated,
            loggedInUserHandle,
            //comments,
            classes,
        } = this.props;
        //Markup to be rendered for displaying comments
        let commentsMarkup = (
            this.props.data.comments.map(
                (comment, index) => (
                    <Fragment key={comment.commentId}>
                        <Grid item sm={12}>
                            <Grid className={classes.grid2} container>
                                {
                                    (authenticated && comment.userHandle === loggedInUserHandle) ? (
                                        <CustomTooltipButtom tip="Delete" onClick={
                                                () => this.handleDeleteButtonClick(comment.commentId)
                                            } btnClassName={classes.deleteButton}>
                                                <DeleteIcon color="secondary"/>
                                        </CustomTooltipButtom>
                                    ) : (null)
                                }
                                <Grid item sm={2}>
                                    <img src={comment.userImage} alt="comment" className={classes.commentImage}/>
                                </Grid>
                                <Grid item sm={9}>
                                    <div className={classes.commentData}>
                                        <Typography variant="h5" color="primary" component={Link} to={`/users/${comment.userHandle}`}>
                                            {comment.userHandle}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {dayjs(comment.createdAt).format('h:mm a, DD MMMM YYYY')}
                                        </Typography>
                                        <hr className={classes.invisibleSeparator}/>
                                        <Typography variant="body1">
                                            {comment.body}
                                        </Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                        {
                            index !== this.props.data.comments.length - 1 && (
                                <hr className={classes.visibleSeparator}/>
                            )
                        }
                    </Fragment>
                )
            )
        );
        return(
            <Grid container>
                {commentsMarkup}
            </Grid>
        );
    };
};

Comments.propTypes = {
    classes: PropTypes.object.isRequired,
    //comments: PropTypes.array.isRequired,
    deleteComment: PropTypes.func.isRequired,
    getCommentsForScream: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired,
    loggedInUserHandle: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated,
    loggedInUserHandle: state.user.credentials.handle,
    data: state.data,
});

const mapActionsToProps = {
    getCommentsForScream,
    deleteComment,
};

export default connect(
    mapStateToProps,
    mapActionsToProps,
)(withStyles(styles)(Comments));