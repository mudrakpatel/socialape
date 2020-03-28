//Import error action types
import {
    SET_ERRORS, 
    CLEAR_ERRORS, 
    LOADING_UI, 
    STOP_LOADING_UI,
} from '../types';

//Initial state for uiReducer
const initialState = {
    loading: false,
    errors: null,
};

//Handle the dispatched actions
export default (state = initialState, action) => {
    switch(action.type){
        case SET_ERRORS:
            return {
                ...state,
                loading: false,
                errors: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                loading: false,
                errors: null,
            };
        case LOADING_UI:
            return {
                ...state,
                loading: true,
            };
        case STOP_LOADING_UI:
            return{
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};