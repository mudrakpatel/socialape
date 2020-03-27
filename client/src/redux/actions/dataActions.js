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
} from '../types';

//Action to get screams
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

//Action to post/ADD a Scream
export const postScream = (newScream) => (dispatch) => {
    dispatch({type: LOADING_UI});
    axios.post('/scream', newScream).then((response) => {
        dispatch({
            type: POST_SCREAM,
            payload: response.data,
        });
        dispatch({type: CLEAR_ERRORS});
    }).catch((err) => {
        dispatch({
            type: SET_ERRORS,
            payload: err.response.data,
        });
    });
};