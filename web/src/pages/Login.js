import React, {Component} from 'react';
import './css/Login.css'
import {withRouter, Link} from 'react-router-dom';
import axios from 'axios';

class Login extends Component {
    state = {
        uname : "",
        pwd : ""
    }

    replaceBack = () => {
        let { from } = this.props.location.state || {from: {pathname: "/"}};
        this.props.history.replace(from);
    }

    replaceCur = () => {
        window.location.href = "/login"
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = async (event) => {
        const {uname, pwd} = this.state;
        const data = {
            uname, pwd
        };
        event.preventDefault();
        try {
            const ret = await axios.post(`${process.env.REACT_APP_HTTP_SERVER_URI}/auth/login`, data);
            console.log('ret', ret.data)
            if (ret.data.logged == true) {
                this.replaceBack();
            } else {
                alert("로그인 실패");
                this.replaceCur();
            }
        } catch(err) {
            console.log('err', err)
            alert("로그인 실패");
            this.replaceCur();
        }
    }

    signupBtnClicked = () => {
        this.props.history.push('/signup');
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit} method="post">
                    <div className="container">
                        <label htmlFor="uname">아이디</label>
                        <input type="text" placeholder="Enter Username" name="uname" onChange={this.handleChange} required />
                        <label htmlFor="pwd">비밀번호</label>
                        <input type="password" placeholder="Enter Password" name="pwd" onChange={this.handleChange} required />
                        <button type="submit">로그인</button>
                        <label>
                            <input type="checkbox" name="remember"/> Remember me
                        </label>
                    </div>
                    <div className="containerBottom" style={{backgroundColor:'#f1f1f1'}}>
                        <button type="button" className="signupBtn" onClick={this.signupBtnClicked}>회원 가입</button>
                        <span className="psw">Forgot <a href="#">password?</a></span>
                    </div>
                </form>
            </div>
        )
    }
}

export default withRouter(Login);