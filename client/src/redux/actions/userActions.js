/**NOTE: All the action types dispatched in this action 
file will be handled in appropriate reducers file**/
import axios from 'axios';
//Import action types
import {SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_UI} from '../types';

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
        //Extract the token from the response data
        const firebaseIdToken = `Bearer ${result.data.token}`;
        //Store the token in the localStorage of the browser
        localStorage.setItem('firebaseIdToken', firebaseIdToken);
        //Add the token to the headers so it can be used in other 
        //actions where authorization checks are required to be done
        axios.defaults.headers.common['Authorization'] = firebaseIdToken;
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

//Get User data Action
export const getUserData = () => (dispatch) => {
    axios.get('/user').then((response) => {
        //Dispatch an action of type 'SET_USER'
        dispatch({type: SET_USER, payload: response.data});
    }).catch((err) => {
        console.log(err);
    });
};