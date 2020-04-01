/**NOTE: All the action types dispatched in this action 
file will be handled in appropriate reducers file**/
import axios from 'axios';
//Import action types
import {
        SET_USER, 
        SET_ERRORS, 
        CLEAR_ERRORS, 
        LOADING_UI, 
        SET_UNAUTHENTICATED, 
        LOADING_USER
    } from '../types';

//Login User Action
/**dispatch is used to run asynchronous code
    history is history passed from 
    Login component to this action**/
export const loginUser = (userData, history) => (dispatch) => {
    //dispatch a type from an action and
    //catch the dispatched type in reducer
    dispatch({type: LOADING_UI});
    //Make a request to '/login' route to our API
    axios.post('/login', userData).then((result) => {
        setAuthorizationHeader(result.data.token);
        //Dispatch getUser action
        dispatch(getUserData());
        //Dispatch CLEAR_ERRORS action type
        //to clear any errors user made while 
        //entering credentials to log in
        dispatch({type: CLEAR_ERRORS,});
        //Redirect the user to the homepage after successfull login
        history.push('/');
    }).catch((err) => {
        dispatch({
            type: SET_ERRORS,
            payload: err.response.data,
        });
    });
};

//Action to get logged in User data
export const getUserData = () => (dispatch) => {
    dispatch({type: LOADING_USER});
    axios.get('/user').then((response) => {
        //Dispatch an action of type 'SET_USER'
        dispatch({type: SET_USER, payload: response.data});
    }).catch((err) => {
        console.log(err);
    });
};

//Action to SignUp a User
export const signupUser = (newUserData, history) => (dispatch) => {
    //Dispatch loading UI
    dispatch({type: LOADING_UI});
    //Make call to the signup route in API
    axios.post('/signup', newUserData).then((result) => {
        setAuthorizationHeader(result.data.token);
        dispatch(getUserData());
        dispatch({type: CLEAR_ERRORS});
        //Redirect the user to the homepage after successfull login
        history.push('/');
    }).catch((err) => {
        dispatch({
            type: SET_ERRORS,
            payload: err.response.data,
        });
    });
};

//Action to Logout a User
export const logoutUser = () => (dispatch) => {
    //Remove the token from the localStorage
    localStorage.removeItem('firebaseIdToken');
    //Remove the token from the Authorization headers
    delete axios.defaults.headers.common['Authorization'];
    //Dispatch type SET_UNAUTHENTICATED
    dispatch({type: SET_UNAUTHENTICATED});
};

//Action to upload an image
export const uploadImage = (formData) => (dispatch) => {
    dispatch({type: LOADING_USER});
    axios.post('/user/image', formData).then(() => {
        dispatch(getUserData());
    }).catch((err) => {
        console.log(err);
    });
};

//Action to edit details of the logged in user
export const editUserDetails = (userDetails) => (dispatch) => {
    dispatch({type: LOADING_USER});
    axios.post('/user', userDetails).then(() => {
        dispatch(getUserData());
    }).catch((err) => {
        console.log(err);
    });
};

/**
 * Helper methods
 */
//Set authorization token in headers
const setAuthorizationHeader = (token) => {
    //Extract the token from the response data
    const firebaseIdToken = `Bearer ${token}`;
    //Store the token in the localStorage of the browser
    localStorage.setItem('firebaseIdToken', firebaseIdToken);
    //Add the token to the headers so it can be used in other 
    //actions where authorization checks are required to be done
    axios.defaults.headers.common['Authorization'] = firebaseIdToken;
};