import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

class OauthCallback extends Component {
    componentDidMount() {
        var naverLogin = new window.naver.LoginWithNaverId(
			{
				clientId: "{YOUR_CLIENT_ID}",
				callbackUrl: "{YOUR_REDIRECT_URL}",
				isPopup: false,
				callbackHandle: true
				/* callback 페이지가 분리되었을 경우에 callback 페이지에서는 callback처리를 해줄수 있도록 설정합니다. */
			}
		);

		/* (3) 네아로 로그인 정보를 초기화하기 위하여 init을 호출 */
        naverLogin.init();
        const setNaverId = this.props.setNaverId;
        const history = this.props.history;
		/* (4) Callback의 처리. 정상적으로 Callback 처리가 완료될 경우 main page로 redirect(또는 Popup close) */
        naverLogin.getLoginStatus(function (status) {
            if (status) {
                /* (5) 필수적으로 받아야하는 프로필 정보가 있다면 callback처리 시점에 체크 */
                var userId = naverLogin.user.getId();
                if( userId == undefined || userId == null) {
                    alert("이메일은 필수정보입니다. 정보제공을 동의해주세요.");
                    /* (5-1) 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
                    naverLogin.reprompt();
                    return;
                }
                setNaverId(userId);
                history.replace(`/`);

                //window.location.replace("http://" + window.location.hostname + ( (location.port==""||location.port==undefined)?"":":" + location.port) + "/sample/main.html");
            } else {
                console.log("callback 처리에 실패하였습니다.");
                history.replace('/');
            }
        });
    }
    render() {
        return(
            <div>
                oauth
            </div>
        )
    }
}

export default withRouter(OauthCallback);