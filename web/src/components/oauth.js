import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

class Oauth extends Component {
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
        const setKakaoId = this.props.setKakaoId;
        // 카카오 로그인 버튼을 생성합니다.
        if (Boolean(window.Kakao.Auth)){
            window.Kakao.Auth.createLoginButton({
                container: '#kakao-login-btn',
                success: function(authObj) {
                    //console.log(JSON.stringify(authObj));
                    window.Kakao.Auth.getStatusInfo((res) => {
                        setKakaoId(res.user.id);
                    })
                },
                fail: function(err) {
                    alert(JSON.stringify(err));
                }
            });
        }
    }

    naverClicked = (event) => {
        console.log('naver');
    }

    kakaoClicked = (event) => {
        console.log('kakao');
    }

    closedButtonClicked = (event) => {
        this.props.modalClose();
    }

    render() {
        const style = {
            iconGap: {
                height: '6px'
            },
            closeButton: {
                display: 'block',
                position: 'fixed',
                right: 0,
                top: 0
            },
            closeIcon: {
                marginTop: '1rem'
            }
        }
        return (
            <div>
                <div className='modal_overlay'/>
                <div className='modal_wrap'>
                    <div className='col_flex'>
                        <div id="kakao-login-btn" onClick={this.kakaoClicked}>
                            <img
                            src="/images/login/kakao_login.png"
                            alt="kakaoLoginIcon"
                            width='200px'
                            />
                        </div>
                        <a href="http://developers.kakao.com/logout"></a>
                        <div id='naverIdLogin' onClick={this.naverClicked}>
                            <img 
                            src="/images/login/naver_login.png"
                            alt="naverLoginIcon"
                            width='200px'
                            />
                        </div>
                        <button onClick={this.closedButtonClicked} style={style.closeIcon}>닫기</button>
                    </div>
                </div>
            </div>
        )
    }
    
}

export default withRouter(Oauth);