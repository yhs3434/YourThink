import React from 'react';
import './App.css';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function App() {
  return (
    <div className="App">
      <p>Hello World! This is someone's thinking application!</p>
      {
        false
        ?<Login/>
        :<SignUp/>
      }
    </div>
  );
}

export default App;
