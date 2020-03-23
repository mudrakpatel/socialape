import axios from 'axios';
//Action type imports
import {SET_SCREAMS, LOADING_DATA, LIKE_SCREAM, UNLIKE_SCREAM} from '../types';

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
            payload: {},
        });
    });
};