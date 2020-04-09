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
        case LOADING_DATA:{
            return {
                ...state,
                loading: true,
            }
        }
        case SET_SCREAM:{
            return {
                ...state,
                scream: action.payload,
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
        case DELETE_SCREAM:{
            let index = state.screams.findIndex(
                (scream) => scream.screamId === action.payload);
            state.screams.splice(index, 1);
            return{
                ...state,
            }
        }
        case POST_SCREAM:{
            return{
                ...state,
                screams: [
                    action.payload,
                    ...state.screams,
                ],
            }
        }
        case SUBMIT_COMMENT:{
            return{
                ...state,
                comments: [
                    action.payload,
                    ...state.comments, //This line might throw a problem
                ],
                scream:{
                    ...state.scream,
                },
            }
        }
        case DELETE_COMMENT:{
            let index = state.comments.findIndex(
                (comment) => comment.commentId === action.payload);
            state.comments.splice(index, 1);
            return {
                ...state.comments,
                ...state,
            }
        }
        default:
            return state;
    }
};