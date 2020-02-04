import React, {Component} from 'react';
import axios from 'axios';
import './Header.css';
import { ReactComponent as NotificationIcon } from './icons/notification.svg';
import {Link} from 'react-router-dom';

class Header extends Component {
    getUserInfo = async () => {
        // 유저데이터 불러오기
    };

    render () {
        return(
            <div className="headerWrap">
                {
                    this.props.logged
                    ?
                    <div className="headerLeft">
                        <Link to="/">홈</Link>
                        <Link to="/my">내 다이어리</Link>
                        <Link to="/other">타인 다이어리</Link>
                    </div>
                    :
                    <div className="headerLeft">
                        <Link to="/">홈</Link>
                    </div>
                }
                <div className="headerMid">
                    {
                        this.props.logged
                        ?
                        <div>
                            <Link to="/writeDiary">글 쓰기</Link>
                        </div>
                        :
                        <div>
                        </div>
                    }
                </div>
                <div className="headerRight">
                    {
                        this.props.logged
                        ?
                        <div> 
                            <NotificationIcon height='20px' width='20px' />
                            <span>사진</span>
                        </div>
                        : 
                        <div>
                            <Link to="/login">로그인</Link>
                            <Link to="/signup">회원 가입</Link>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default Header;