import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import './App.css';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/login" component={Login}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
