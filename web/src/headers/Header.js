import React, {Component} from 'react';
import axios from 'axios';
import './Header.css';
import { ReactComponent as NotificationIcon } from './icons/notification.svg';
import { ReactComponent as AccountIcon } from './icons/account_box-24px.svg';
import { ReactComponent as MenuIcon } from './icons/menu-24px.svg';
import {Link, withRouter} from 'react-router-dom';

class Header extends Component {
    state = {
        myMenuClick: false,
        drawerClick: false
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

    modalBackgroundClicked = (event) => {
        this.myMenuClickedClose();
    }

    drawerClicked = (event) => {
        this.setState({
            drawerClick: !this.state.drawerClick
        })
    }

    render () {
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
                boxShadow: '2px 2px 7px #b3b3b3',
                zIndex: '100'
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
            },
            modalBackground: {
                position: 'fixed',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                zIndex: '10',
                backgroundColor: 'rgba(0,0,0, 0.2)'
            },
            drawer: {
                display: 'flex',
                position: 'fixed',
                left: '0px',
                top: '0px',
                width: '40%',
                height: '100%',
                backgroundColor: 'white',
                flexDirection: 'column',
                paddingTop: '50px',
                paddingBottom: '50px',
                alignItems: 'center',
                fontSize: '20px'
            },
            drawerBack: {
                display: 'block',
                position: 'fixed',
                left: '0px',
                top: '0px',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0, 0.2)'
            }
        }
        return(
            <div className="headerWrap">
                <nav className="headerLeft">
                    <Link className="headerDesktop" to="/my" style={{marginRight: '10px'}}>나의 생각</Link>
                    <Link className="headerDesktop" to="/other">너의 생각</Link>
                    <div className="headerMobile">
                        <div style={this.state.drawerClick ? style.drawerBack : {display: 'none'}} onClick={this.drawerClicked}></div>
                        <div style={this.state.drawerClick ? style.drawer : {display: 'none'}}>
                            <Link className="drawerItem" to="/my" onClick={this.drawerClicked}>나의 생각</Link>
                            <Link className="drawerItem" to="/other" onClick={this.drawerClicked}>너의 생각</Link>
                        </div>
                    </div>
                    <div className="headerMobile"><MenuIcon style={{cursor: 'pointer'}} onClick={this.drawerClicked}/></div>
                    
                </nav>
                <div className="headerMid"></div>
                <div className="headerRight">
                    {
                        this.props.logged
                        ?
                        <div style={style.headerRightRight}> 
                            <div style={{position: 'relative'}}>
                                <div onClick={this.myMenuClicked} style={style.my}><AccountIcon height='40px' width='40px'/></div>
                                
                                <div style={this.state.myMenuClick?style.modalBackground:{display: 'none'}} onClick={this.modalBackgroundClicked}/>
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