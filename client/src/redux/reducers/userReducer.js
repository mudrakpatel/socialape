/** NOTE: All the actions dispatched in the 
    userActions file are handled in this file**/

//Import action types
import {
    SET_USER,
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED,
    LOADING_USER,
    LIKE_SCREAM,
    UNLIKE_SCREAM,
} from '../types';

//Initial state of the userReducer
const initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: [],
};

//Handle dispatched actions in the exported function below
export default (state = initialState, action) => {
    switch(action.type){
        case SET_AUTHENTICATED:
            return {
                ...state,
                authenticated: true,
            }
        case SET_UNAUTHENTICATED:
            return initialState;
        case SET_USER:
            return {
                authenticated: true,
                loading: false,
                ...action.payload,
            }
        case LOADING_USER:
            return {
                ...state,
                loading: true,
            }
        case LIKE_SCREAM:
            return {
                ...state,
                likes: [
                    ...state.likes,
                    {
                        userHandle: state.credentials.handle,
                        screamId: action.payload.screamId,
                    },
                ],
            }
        case UNLIKE_SCREAM:
            return {
                ...state,
                likes: state.likes.filter(
                    (like) => like.screamId === action.payload.screamId)
            }
        default:
            return state;
    }
};