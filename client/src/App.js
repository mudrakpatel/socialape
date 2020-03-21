import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import MaterialThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import jwtDecode from 'jwt-decode'; //To decode firebse authentiction token
import axios from 'axios';
import './App.css';
//Redux imports
import {Provider} from 'react-redux';
import store from './redux/store';
import {SET_AUTHENTICATED} from './redux/types';
import {logoutUser, getUserData} from './redux/actions/userActions';
//App theme
import themeFile from './util/theme';
import AuthRoute from './util/AuthRoute';
//Components
import Navbar from './components/Navbar';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';

//Initialize a MaterialUI theme
const theme = createMuiTheme(themeFile);
//Get Authentication token from localStorage object
const token = localStorage.firebaseIdToken;
//Check if the token exists
//If the token exists, then decode the token
if(token){
  const decodedToken = jwtDecode(token);
  //Check if the decoded token has expired or not
  if(decodedToken.exp *1000 < Date.now()){
    //Logout User
    store.dispatch(logoutUser());
    //Redirect user to the login page
    window.location.href = '/login';
  } else {
    store.dispatch({type: SET_AUTHENTICATED});
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <MaterialThemeProvider theme={theme}>
      {/* Wrap the div and its child elements
        inside a Store Provider so the child
        elements can access the store */}
      <Provider store={store}>
          <BrowserRouter>
            <Navbar/>
            <div className="container">
              <Switch>
                <Route exact path="/" component={Home}/>
                <AuthRoute exact path="/signup" component={Signup} />
                <AuthRoute exact path="/login" component={Login} />
              </Switch>
            </div>
          </BrowserRouter>
      </Provider>
    </MaterialThemeProvider>
  );
}

export default App;
