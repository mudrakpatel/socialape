/** NOTE: All the actions dispatched in the 
    userActions file are handled in this file**/

    //Import action types
import {
    SET_USER,
    SET_AUTHENTICATED,
    SET_UNAUTHENTICATED
} from '../types';

//Initial state of the userReducer
const initialState = {
    authenticated: false,
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
                ...action.payload,
            }
        default:
            return state;
    }
};