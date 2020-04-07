import React, {Component} from 'react';
import axios from 'axios';
import './Header.css';
import { ReactComponent as NotificationIcon } from './icons/notification.svg';
import {Link, withRouter} from 'react-router-dom';

class Header extends Component {
    state = {
        myMenuClick: false
    }

    componentDidMount() {
    }

    getUserInfo = async () => {
        // 유저데이터 불러오기
    };

    myMenuClicked = (event) => {
        if (this.state.myMenuClick === false) {
            this.setState({
                myMenuClick: true
            });
        }
        else {
            this.setState({
                myMenuClick: false
            });
        }
    }

    // 메뉴 펼치기, 접기
    myMenuClickedOpen = (event) => {
        this.setState({
            myMenuClick: true
        })
    }

    myMenuClickedClose = (event) => {
        this.setState({
            myMenuClick: false
        })
    }

    saveMineClicked = (event) => {
        this.props.history.push('/redirect/save/mine');
        this.myMenuClickedClose();
    }

    saveYoursClicked = (event) => {
        this.props.history.push('/redirect/save/yours');
        this.myMenuClickedClose();
    }

    render () {
        if (Boolean(document.getElementById('mymenu'))) {
            let mymenu = document.getElementById('mymenu');
            mymenu.addEventListener('click', this.stopEvent);
        }
        const style = {
            my: {
                cursor: 'pointer'
            },
            myMenu: {
                position: 'absolute',
                top: '3rem',
                right: '0rem',
                width: '250px',
                backgroundColor: 'white',
                boxShadow: '2px 2px 7px #b3b3b3'
            },
            myMenuLi: {
                cursor: 'pointer',
            },
            myMenuUl: {
                lineHeight: '34px',
                fontSize: '18px'
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
                                <div onClick={this.myMenuClicked} style={style.my}>사진</div>
                                <div style={this.state.myMenuClick?style.myMenu:style.myMenuHidden} id='mymenu'>
                                    <ul style={style.myMenuUl}>
                                        <li><span onClick={this.saveMineClicked} style={style.myMenuLi}>저장한 나의 글</span></li>
                                        <li><span onClick={this.saveYoursClicked} style={style.myMenuLi}>저장한 너의 글</span></li>
                                        <li><span style={style.myMenuLi}>고객센터</span></li>
                                        <li><span onClick={this.props.logOut} style={style.myMenuLi}>로그아웃</span></li>
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

export default withRouter(Header);