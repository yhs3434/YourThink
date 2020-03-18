import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

class Oauth extends Component {
    componentDidMount() {
        const naverLogin = new window.naver.LoginWithNaverId(
            {
                clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
                callbackUrl: process.env.REACT_APP_NAVER_CALLBACK_URL,
                isPopup: true,
                loginButton: {color: "green", type: 3, height: 50} /* 로그인 버튼의 타입을 지정 */
            }
        );
        
       /* 설정정보를 초기화하고 연동을 준비 */
        naverLogin.init();
    }

    naverClicked = (event) => {
        console.log('naver');
    }

    kakaoClicked = (event) => {
        console.log('kakao');
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
            }
        }
        return (
            <div>
                <div>
                    <button style={style.closeButton}>X</button>
                </div>
                <div className='col_flex'>
                    <div onClick={this.kakaoClicked}>
                        <img
                        src="/images/login/kakao_login.png"
                        alt="kakaoLoginIcon"
                        width='200px'
                        />
                    </div>
                    <div style={style.iconGap}/>
                    <div id='naverIdLogin' onClick={this.naverClicked}>
                        <img 
                        src="/images/login/naver_login.png"
                        alt="naverLoginIcon"
                        width='200px'
                        />
                    </div>
                </div>
            </div>
        )
    }
    
}

export default withRouter(Oauth);