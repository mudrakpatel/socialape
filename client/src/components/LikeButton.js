import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types'
//Material UI (MUI) imports

//Icon imports
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
//Redux imports
import {connect} from 'react-redux';
//Utilities ('util' folder) imports
import CustomTooltipButton from '../util/CustomTooltipButton';
//Action imports
import {likeScream, unlikeScream} from '../redux/actions/dataActions';


class LikeButton extends Component{
    //Method to check if the logged in
    //user has liked this particular scream
    likedScream = () => {
        const {
            user,
            screamId
        } = this.props;
        //Check if the user has any likes
        //and check if this scream is liked
        if (user.likes && user.likes.find(
                (like) => like.screamId === screamId
            )) {
            return true;
        } else {
            return false;
        }
    };

    //Method to like this scream
    likeScream = () => {
        /*NOTE: 'likeScream' destructured from 'this.props'
                is the imported action from Redux store.*/
        const {
            likeScream,
            screamId
        } = this.props;
        likeScream(screamId);
    };

    //Method to unlike this scream
    unlikeScream = () => {
        /*NOTE: 'unlikeScream' destructured from 'this.props'
                is the imported action from Redux store.*/
        const {
            unlikeScream,
            screamId
        } = this.props;
        unlikeScream(screamId);
    };

    render(){
        const {
            user: {
                authenticated,
            },
        } = this.props;
        const likeButton = !authenticated ? (
            <Link to="/login">
                <CustomTooltipButton tip="Like">
                    <FavoriteBorderIcon color="primary"/>
                </CustomTooltipButton>
            </Link>
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
        return likeButton;
    };
};

LikeButton.propTypes = {
    likeScream: PropTypes.func.isRequired,
    unlikeScream: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    screamId: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
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
)(LikeButton);