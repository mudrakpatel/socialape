import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import MaterialThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import jwtDecode from 'jwt-decode'; //To decode firebse authentiction token

import './App.css';
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
let authenticated;
//Get Authentication token from localStorage object
const token = localStorage.firebaseIdToken;
//Check if the token exists
//If the token exists, then decode the token
if(token){
  const decodedToken = jwtDecode(token);
  //Check if the decoded token has expired or not
  if(decodedToken.exp *1000 < Date.now()){
    //Token expired so redirect user to the login page
    window.location.href = '/login';
    authenticated = false;
  } else {
    authenticated = true;
  }
}

function App() {
  return (
    <MaterialThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
          <Navbar/>
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home}/>
              <AuthRoute exact path="/signup" component={Signup} authenticated={authenticated}/>
              <AuthRoute exact path="/login" component={Login} authenticated={authenticated}/>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    </MaterialThemeProvider>
  );
}

export default App;
