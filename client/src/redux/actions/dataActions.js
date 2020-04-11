import axios from 'axios';
//Action type imports
import {
    SET_SCREAMS,
    LOADING_DATA,
    LIKE_SCREAM, 
    UNLIKE_SCREAM, 
    DELETE_SCREAM,
    LOADING_UI,
    POST_SCREAM,
    SET_ERRORS,
    CLEAR_ERRORS,
    SET_SCREAM,
    STOP_LOADING_UI,
    SUBMIT_COMMENT,
    DELETE_COMMENT,
    SET_COMMENTS,
} from '../types';

//Action to get one Scream
export const getScream = (screamId) => (dispatch) => {
    dispatch({type: LOADING_UI});
    axios.get(`/scream/${screamId}`).then((response) => {
        dispatch({
            type: SET_SCREAM,
            payload: response.data,
        });
        dispatch({type: STOP_LOADING_UI});
    }).catch((err) => {
        console.log(err);
    });
};

//Action to retrieve comments for a particular Scream
export const getCommentsForScream = (screamId) => (dispatch) => {
    axios.get(`/comments/${screamId}`).then((response) => {
        dispatch({
            type: SET_COMMENTS,
            payload: response.data.comments,
        });
    }).catch((err) => {
        console.log(err);
    });
};

//Action to get all screams
export const getScreams = () => (dispatch) => {
    dispatch({type: LOADING_DATA});
    axios.get('/screams').then((response) => {
        dispatch({
            type: SET_SCREAMS,
            payload: response.data,
        });
    }).catch((err) => {
        dispatch({
            type: SET_SCREAMS,
            payload: [],
        });
    });
};

//Action to like a Scream
export const likeScream = (screamId) => (dispatch) => {
    axios.get(`/scream/${screamId}/like`).then((response) => {
        dispatch({
            type: LIKE_SCREAM,
            payload: response.data,
        });
    }).catch((err) => {
        console.log(err);
    });
};

//Action to unlike a Scream
export const unlikeScream = (screamId) => (dispatch) => {
    axios.get(`/scream/${screamId}/unlike`).then((response) => {
        dispatch({
            type: UNLIKE_SCREAM,
            payload: response.data,
        });
    }).catch((err) => {
        console.log(err);
    });
};

//Action to delete a Scream
export const deleteScream = (screamId) => (dispatch) => {
    axios.delete(`/scream/${screamId}`).then(() => {
        dispatch({
            type: DELETE_SCREAM,
            payload: screamId,
        });
    }).catch((err) => {
        console.log(err);
    });
};

//Delete a comment posted on a Scream
export const deleteComment = (commentId) => (dispatch) => {
    console.log(`Comment ID: ${commentId}`);
    axios.delete(`/comment/${commentId}`).then(() => {
        dispatch({
            type: DELETE_COMMENT,
            payload: commentId,
        });
    }).catch((err) => {
        console.log(err.message);
    });
};

//Action to post/ADD a Scream
export const postScream = (newScream) => (dispatch) => {
    dispatch({type: LOADING_UI});
    axios.post('/scream', newScream).then((response) => {
        dispatch({
            type: POST_SCREAM,
            payload: response.data,
        });
        dispatch(clearErrors());
    }).catch((err) => {
        dispatch({
            type: SET_ERRORS,
            payload: err.response.data,
        });
    });
};

//Comment on a Scream
export const submitComment = (screamId, commentData) => (dispatch) => {
    axios.post(`/scream/${screamId}/comment`, commentData).then((response) => {
        dispatch({
            type: SUBMIT_COMMENT,
            payload: response.data,
        });
        dispatch(clearErrors());
    }).catch((err) => {
        dispatch({
            type: SET_ERRORS,
            payload: err.response.data,
        });
    });
};

//Action to get other user data
export const getOtherUserData = (userHandle) => (dispatch) => {
    dispatch({type: LOADING_DATA,});
    axios.get(`/user/${userHandle}`).then((response) => {
        dispatch({
            type: SET_SCREAMS,
            payload: response.data.screams,
        });
    }).catch(() => {
        dispatch({
            type: SET_SCREAMS,
            payload: null,
        });
    });
};

//Action to clear errors from state
export const clearErrors = () => (dispatch) => {
    dispatch({type: CLEAR_ERRORS});
};