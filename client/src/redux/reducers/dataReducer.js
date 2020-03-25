/** NOTE: All the actions dispatched in the 
    dataActions file are handled in this file**/

//Import Action types
import {
    SET_SCREAMS,
    LIKE_SCREAM,
    UNLIKE_SCREAM,
    DELETE_SCREAM,
    LOADING_DATA,
} from '../types';

//Initial state of the data reducer
const initialState = {
    screams: [],
    scream: {},
    loading: false,
};

export default (state = initialState, action) => {
    switch(action.type){
        case LOADING_DATA:
            return{
                ...state,
                loading: true,
            }
        case SET_SCREAMS:
            return{
                ...state,
                screams: action.payload,
                loading: false,
            }
        case LIKE_SCREAM:
        case UNLIKE_SCREAM:
            let index = state.screams.findIndex(
                (scream) => scream.screamId === action.payload.screamId);
                state.screams[index] = action.payload;
            return{
                ...state,
            }
        case DELETE_SCREAM:
            index = state.screams.findIndex(
                (scream) => scream.screamId === action.payload.screamId);
            state.screams.splice(index, 1);
            return{
                ...state,
            }
        default:
            return state;
    }
};