import React, {useState} from 'react';
import './App.css';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Header from './headers/Header';
import WriteDiary from './pages/WriteDiary';
import MyDiary from './pages/MyDiary';
import OtherDiary from './pages/OtherDiary';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

function App() {
  const [logged, setLogged] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  const logIn = () => {
    setLogged(true);
  }

  const logOut = () => {
    setLogged(false);
  }

  return (
    <Router>
      <div className="App">
        <button onClick={logIn}>login</button>
        <button onClick={logOut}>logout</button>
        <header className="mainHeader">
          <Header logged={logged}/>
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
          <Route path = "/writeDiary">
            <WriteDiary logged={logged}/>
          </Route>
          <Route path = "/my">
            <MyDiary />
          </Route>
          <Route path = "/other">
            <OtherDiary />
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
