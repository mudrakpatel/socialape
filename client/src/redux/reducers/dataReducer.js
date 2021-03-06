/** NOTE: All the actions dispatched in the 
    dataActions file are handled in this file**/

//Import Action types
import {
    SET_SCREAMS,
    SET_SCREAM,
    LIKE_SCREAM,
    UNLIKE_SCREAM,
    DELETE_SCREAM,
    LOADING_DATA,
    POST_SCREAM,
    SUBMIT_COMMENT,
    DELETE_COMMENT,
    SET_COMMENTS,
} from '../types';

//Initial state of the data reducer
const initialState = {
    screams: [],
    scream: {},
    comments: [], //For the individual Scream object
    loading: false,
};

export default (state = initialState, action) => {
    switch(action.type){
        case POST_SCREAM: {
            return {
                ...state,
                screams: [
                    action.payload,
                    ...state.screams,
                ],
            }
        }
        case SUBMIT_COMMENT: {
            state.scream.commentCount = state.scream.commentCount + 1;
            return {
                ...state,
                comments: [
                    action.payload,
                    ...state.comments,
                ],
                scream: {
                    ...state.scream,
                },
            }
        }
        case DELETE_SCREAM: {
            let index = state.screams.findIndex(
                (scream) => scream.screamId === action.payload);
            state.screams.splice(index, 1);
            return {
                ...state,
            }
        }
        case DELETE_COMMENT: {
            state.scream.commentCount = state.scream.commentCount - 1;
            let index = state.comments.findIndex(
                (comment) => comment.commentId === action.payload);
            state.comments.splice(index, 1);
            return {
                ...state,
            }
        }
        case SET_SCREAM:{
            return {
                ...state,
                scream: action.payload,
                loading: false,
            }
        }
        case SET_COMMENTS:{
            return{
                ...state,
                comments: action.payload,
                loading: false,
            }
        }
        case SET_SCREAMS:{
            return{
                ...state,
                screams: action.payload,
                loading: false,
            }
        }
        case LIKE_SCREAM:
        case UNLIKE_SCREAM:{
            let index = state.screams.findIndex(
                (scream) => scream.screamId === action.payload.screamId);
            state.screams[index] = action.payload;
            if(state.scream.screamId === action.payload.screamId){
                state.scream = action.payload;
            } 
            return{
                ...state,
            }
        }
        case LOADING_DATA: {
            return {
                ...state,
                loading: true,
            }
        }
        default:
            return state;
    }
};