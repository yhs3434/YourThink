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
import ModifyDiary from './pages/ModifyDiary';
import OauthCallback from './components/oauthCallback';

import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import axios from 'axios';

function App() {
  const [logged, setLogged] = useState(true);
  const [accessToken, setAccessToken] = useState('');
  const [userId, setUserId] = useState('');
  useEffect(() => {
    // indexedDB 가 지원하지 않는 경우
    if (!window.indexedDB) {
      window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.")
    }
    window.Kakao.init(process.env.REACT_APP_KAKAO_KEY);
  }, [])

  const setNaverId = (id) => {
    setUserId(id);
    sessionStorage[`${process.env.REACT_APP_APP_NAME}.platform`] = 'naver';
    sessionStorage[`${process.env.REACT_APP_APP_NAME}.userId`] = id;
  }

  const setKakaoId = (id) => {
    setUserId(id);
    sessionStorage[`${process.env.REACT_APP_APP_NAME}.platform`] = 'kakao';
    sessionStorage[`${process.env.REACT_APP_APP_NAME}.userId`] = id;
  }

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
          <p>{userId}</p>
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
          <Route name="detailPage" path = "/detail/:id">
            <DetailDiary 
              setKakaoId={setKakaoId}
            />
          </Route>
          <Route path="/modify/:id" component={ModifyDiary}/>
          <Route path="/oauth">
            <OauthCallback setNaverId={setNaverId}/>
          </Route>
          <Route exact path = "/">
            <Home/>
          </Route>
          <Route path="/home/:id">
            <Home/>
          </Route>
        </Switch>
        <footer>
          this is footer
        </footer>
      </div>
    </Router>
  );
}

export default App;
