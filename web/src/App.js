import React, {useState, useEffect} from 'react';
import './App.css';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Header from './headers/Header';
import WriteDiary from './pages/WriteDiary';
import MyDiary from './pages/MyDiary';
import OtherDiary from './pages/OtherDiary';
import DetailDiary from './pages/DetailDiary';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import axios from 'axios';

function App() {
  const [logged, setLogged] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  useEffect(() => {
    // indexedDB 가 지원하지 않는 경우
    if (!window.indexedDB) {
      window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.")
    }
  })

  const logIn = () => {
    setLogged(true);
  }

  const logOut = () => {
    setLogged(false);
  }

  const sayHello = async () => {
    await axios.get('http://localhost:3001/api/hello',{withCredentials: true});
  }

  return (
    <Router>
      <div className="App">
        <button onClick={logIn}>login</button>
        <button onClick={logOut}>logout</button>
        {
          // <button onClick={sayHello}>send hello</button>
        }
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
          <Route path = "/detail/:id" component={DetailDiary}/>
          <Route exact path = "/">
            <Home/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
