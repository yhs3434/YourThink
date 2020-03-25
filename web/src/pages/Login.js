import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

class Login extends Component {
componentDidMount() {
    const naverLogin = new window.naver.LoginWithNaverId(
        {
            clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
            callbackUrl: `${process.env.REACT_APP_NAVER_CALLBACK_URL}`,
            isPopup: false,
            loginButton: {color: "green", type: 3, height: 48} /* 로그인 버튼의 타입을 지정 */
        }
    );

   /* 설정정보를 초기화하고 연동을 준비 */
    naverLogin.init();

    // 사용할 앱의 JavaScript 키를 설정해 주세요.
    // window.Kakao.init(process.env.REACT_APP_KAKAO_KEY);
    
    const props = this.props;
    // 카카오 로그인 버튼을 생성합니다.
    window.Kakao.Auth.createLoginButton({
        container: '#kakao-login-btn',
        success: function(authObj) {
            //console.log(JSON.stringify(authObj));
            window.Kakao.Auth.getStatusInfo((res) => {
                props.setKakaoId(res.user.id);
            });
            props.history.replace('/');
        },
        fail: function(err) {
            alert(JSON.stringify(err));
        }
    });
}

    render() {
        const style = {
            wrap: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            },
            authWrap: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '90%',
                height: '400px',
                backgroundColor: 'white'
            }
        }
        return (
            <div style={style.wrap}>
                <article style={style.authWrap}>
                    <div id="kakao-login-btn" onClick={this.kakaoClicked}></div>
                    <div id='naverIdLogin' onClick={this.naverClicked}></div>
                </article>
            </div>
        )
    }
}

export default withRouter(Login);