import React, {useState, useEffect} from 'react';
import './App.css';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Header from './headers/Header';
import Footer from './headers/Footer';
import WriteDiary from './pages/WriteDiary';
import MyDiary from './pages/MyDiary';
import OtherDiary from './pages/OtherDiary';
import DetailDiary from './pages/DetailDiary';
import ModifyDiary from './pages/ModifyDiary';
import OauthCallback from './components/oauthCallback';
import SaveDiary from './pages/SaveDiary';

import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import axios from 'axios';

function App() {
  const [logged, setLogged] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    // indexedDB 가 지원하지 않는 경우
    if (!window.indexedDB) {
      window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.")
    }
    window.Kakao.init(process.env.REACT_APP_KAKAO_KEY);
  }, []);

  useEffect(() => {
    if (Boolean(sessionStorage[`${process.env.REACT_APP_APP_NAME}.logged`])) {
      if (sessionStorage[`${process.env.REACT_APP_APP_NAME}.platform`] === 'kakao') {
        setNaverId(sessionStorage[`${process.env.REACT_APP_APP_NAME}.userId`]);
      } else if (sessionStorage[`${process.env.REACT_APP_APP_NAME}.platform`] === 'naver') {
        setKakaoId(sessionStorage[`${process.env.REACT_APP_APP_NAME}.userId`]);
      }
    } else {
      logOut();
    }
  }, [logged]);

  const setNaverId = (id) => {
    logIn('naver', id);
  }

  const setKakaoId = (id) => {
    logIn('kakao', id);
  }

  const logIn = (platform, userId) => {
    setLogged(true);
    setUserId(userId);
    sessionStorage[`${process.env.REACT_APP_APP_NAME}.logged`] = 'true'
    sessionStorage[`${process.env.REACT_APP_APP_NAME}.platform`] = platform;
    sessionStorage[`${process.env.REACT_APP_APP_NAME}.userId`] = userId;
  }

  const logOut = () => {
    setLogged(false);
    setUserId(null);
    sessionStorage.removeItem(`${process.env.REACT_APP_APP_NAME}.platform`);
    sessionStorage.removeItem(`${process.env.REACT_APP_APP_NAME}.userId`);
    sessionStorage.removeItem(`${process.env.REACT_APP_APP_NAME}.logged`);
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
          <Header logged={logged} logOut={logOut} />
        </header>
        <nav>
          <span>{userId}</span>
        </nav>
        <section className="appBody">
          <Switch>
            <Route path = "/signup">
              <SignUp/>
            </Route>
            <Route path = "/login">
              <Login setKakaoId={setKakaoId}/>
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
            <Route path="/save/:mode">
              <SaveDiary/>
            </Route>
          </Switch>
        </section>
        {
          /*
          <footer className="footer">
            <Footer />
          </footer>
          */
        }
      </div>
    </Router>
  );
}

export default App;
