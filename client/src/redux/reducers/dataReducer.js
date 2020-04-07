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
                scream:{
                    ...state.scream,
                    comments: [
                        action.payload,
                        ...state.scream.comments,
                    ],
                },
            }
        }
        case DELETE_COMMENT:{
            let newComments = state.scream.comments.filter(
                (comment) => comment.commentId !== action.payload);
            state.scream.comments = newComments;
            return {
                ...state,
            }
        }
        default:
            return state;
    }
};