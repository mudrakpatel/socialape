import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
//Redux imports
import {connect} from 'react-redux';
//Action imports
import {likeScream, unlikeScream} from '../redux/actions/dataActions';
//Utilities ('util' folder) imports
import CustomTooltipButton from '../util/CustomTooltipButton';
//Component imports
import DeleteScream from './DeleteScream';
//MUI (Material UI) imports
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
//Icon imports
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20,
    },
    image: {
        minWidth: 200,
    },
    content: {
        padding: 25,
        objectFit: 'cover',
    },
};

class Scream extends Component {

    //Method to check if the logged in
    //user has liked this particular scream
    likedScream = () => {
        const {user, scream} = this.props;
        //Check if the user has any likes
        //and check if this scream is liked
        if(user.likes && user.likes.find(
            (like) => like.screamId === scream.screamId
        )){
            return true;
        }else{
            return false;
        }
    };

    //Method to like this scream
    likeScream = () => {
        /*NOTE: 'likeScream' destructured from 'this.props'
                is the imported action from Redux store.*/
        const {likeScream, scream} = this.props;
        likeScream(scream.screamId);
    };

    //Method to unlike this scream
    unlikeScream = () => {
        /*NOTE: 'unlikeScream' destructured from 'this.props'
                is the imported action from Redux store.*/
        const {unlikeScream, scream} = this.props;
        unlikeScream(scream.screamId);
    };

    render(){
        dayjs.extend(relativeTime);
        const { 
            classes,
            user: {
                authenticated,
                credentials: {
                    handle,
                },
            },
            scream: {
                body,
                createdAt,
                userImage,
                userHandle,
                screamId,
                likeCount,
                commentCount,
            }
        } = this.props;
        //Like button
        const likeButton = !authenticated ? (
            <CustomTooltipButton tip="Like">
                <Link to="/login">
                    <FavoriteBorderIcon color="primary"/>
                </Link>
            </CustomTooltipButton>
        ) : (
            /*
                The user is logged in, so 
                now check if this scream is
                liked or not by the logged in user.
            */
            this.likedScream() ? (
                <CustomTooltipButton tip="Undo like" onClick={this.unlikeScream}>
                    <FavoriteIcon color="primary"/>
                </CustomTooltipButton>
            ) : (
                <CustomTooltipButton tip="Like" onClick={this.likeScream}>
                    <FavoriteBorderIcon color="primary"/>
                </CustomTooltipButton>
            )
        );
        //Delete button
        const deleteButton = authenticated && userHandle === handle ? (
            <DeleteScream screamId={screamId}/>
        ) : (null);
        return (
            <Card className={classes.card}>
                <CardMedia image={userImage} title="Profile image" className={classes.image} />
                <CardContent className={classes.content}>
                    <Typography variant="h5" component={Link}
                        to={`/users/${userHandle}`} color="primary">
                        {userHandle}
                    </Typography>
                    {deleteButton}
                    <Typography variant="body2" color="textSecondary">
                        {dayjs(createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body1">
                        {body}
                    </Typography>
                    {likeButton}
                    <span>
                        {likeCount} Likes
                    </span>
                    <CustomTooltipButton tip="Comments">
                        <ChatIcon color="primary" />
                    </CustomTooltipButton>
                    <span>
                        {commentCount} comments
                    </span>
                </CardContent>
            </Card>
        );
    };
};

Scream.propTypes = {
    user: PropTypes.object.isRequired,
    scream: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.user,
});

const mapActionsToProps = {
    likeScream,
    unlikeScream,
};

export default connect(
    mapStateToProps,
    mapActionsToProps,
)(withStyles(styles)(Scream));