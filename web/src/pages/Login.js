import React, {Component} from 'react';
import './css/Login.css'

export default class Login extends Component {
    render() {
        return (
            <div>
                <form action="" method="post">
                    <div className="container">
                        <label htmlFor="uname">Username</label>
                        <input type="text" placeholder="Enter Username" name="uname" required />
                        <label htmlFor="pwd">Password</label>
                        <input type="password" placeholder="Enter Password" name="pwd" required />
                        <button type="submit">Login</button>
                        <label>
                            <input type="checkbox" name="remember"/> Remember me
                        </label>
                    </div>
                    <div className="containerBottom" style={{backgroundColor:'#f1f1f1'}}>
                        <button type="button" className="cancelbtn">Cancel</button>
                        <span className="psw">Forgot <a href="#">password?</a></span>
                    </div>
                </form>
            </div>
        )
    }
}