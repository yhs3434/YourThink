import React, {Component} from 'react';
import axios from 'axios';
import './Header.css';
import { ReactComponent as NotificationIcon } from './icons/notification.svg';
import {Link, withRouter} from 'react-router-dom';

class Header extends Component {
    state = {
        myMemuClick: false
    }

    getUserInfo = async () => {
        // 유저데이터 불러오기
    };

    myMenuClicked = (event) => {
        this.setState({
            myMemuClick: !this.state.myMemuClick
        })
    }

    render () {
        const style = {
            myMenu: {
                position: 'absolute',
                top: '3rem',
                right: '0rem',
                width: '250px',
                backgroundColor: 'white'
            },
            myMenuHidden: {
                display: 'none'
            },
            headerRightRight: {
                display: 'flex',
            }
        }
        return(
            <div className="headerWrap">
                <nav className="headerLeft">
                    {
                        //<Link to="/">홈</Link>
                    }
                    <Link to="/my">나의 다이어리</Link>
                    <Link to="/other">너의 다이어리</Link>
                </nav>
                <div className="headerMid"></div>
                <div className="headerRight">
                    {
                        this.props.logged
                        ?
                        <div style={style.headerRightRight}> 
                            <NotificationIcon height='20px' width='20px' />
                            <div style={{position: 'relative'}}>
                                <span onClick={this.myMenuClicked}>사진</span>
                                <div style={this.state.myMemuClick?style.myMenu:style.myMenuHidden}>
                                    <ul>
                                        <li>저장한 나의 글</li>
                                        <li>저장한 너의 글</li>
                                        <li>고객센터</li>
                                        <li><span onClick={this.props.logOut}>로그아웃</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        : 
                        <div>
                            <Link to="/login">로그인</Link>
                            {
                                //<Link to="/signup">회원 가입</Link>
                            }
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default Header;