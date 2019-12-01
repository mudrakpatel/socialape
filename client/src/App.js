import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import MaterialThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';

//Initialize a MaterialUI theme
const theme = createMuiTheme({
  palette: {
    primary: {
        light: '#33c9dc',
        main: '#00bcd4',
        dark: '#008394',
        contrastText: '#fff'
      },
      secondary: {
        light: '#ff6333',
        main: '#ff3d00',
        dark: '#b22a00',
        contrastText: '#fff'
      },
  },
  typography: {
    useNextVariants: true,
  },
});

function App() {
  return (
    <MaterialThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
          <Navbar/>
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/signup" component={Signup}/>
              <Route path="/login" component={Login}/>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    </MaterialThemeProvider>
  );
}

export default App;
