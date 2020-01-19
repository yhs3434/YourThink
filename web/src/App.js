import React from 'react';
import './App.css';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Header from './headers/Header';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="mainHeader">
          <Header/>
        </header>
        <nav>
          <p>Hello World! This is someone's thinking application!</p>
        </nav>
        <Switch>
          <Route path = "/signup">
            <SignUp/>
          </Route>
          <Route path = "/login">
            <Login/>
          </Route>
          <Route exact path = "/">
            <Home/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
