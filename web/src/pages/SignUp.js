import React, {Component} from 'react';

export default class SignUp extends Component {
    render () {
        return (
            <div>
                <form action="" method="post">
                    <div className="container">
                        <label htmlFor="uname">사용자 이름</label>
                        <input type="text" placeholder="사용자 이름" name="uname" required />
                        <label htmlFor="pwd">비밀번호</label>
                        <input type="password" placeholder="비밀번호" name="pwd" required />
                        <label htmlFor="pwd">확인</label>
                        <input type="password" placeholder="확인" name="pwd_chk" required />
                        <div>
                            <input type="email" placeholder="이메일 주소" name="email" required/>
                            <button type="button" className="certbtn">보내기</button>
                        </div>
                        <input type="number" placeholder="인증 번호" name="emailchk" required/>
                        <button type="submit">가입</button>
                    </div>
                    <div className="containerBottom" style={{backgroundColor:'#f1f1f1'}}>
                        <button type="button" className="cancelbtn">Cancel</button>
                        <span></span>
                    </div>
                </form>
            </div>
        )
    }
}