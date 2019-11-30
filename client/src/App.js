import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';

function App() {
  return (
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
  );
}

export default App;
