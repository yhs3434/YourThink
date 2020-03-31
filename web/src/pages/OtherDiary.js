import React, {Component} from 'react';
import './css/OtherDiary.css';
import {encodeToWs, decodeFromWs} from '../lib/websocket';
import {datetimeToMysql} from '../lib/mysql';

class OtherDiary extends Component {
    state = {
        memoTitle: null,
        memoContent: null,
        published: null
    }

    getDiary = () => {
        const ws = new WebSocket(process.env.REACT_APP_SERVER_SOCKET_URL);
        const message = {
            type: 'publicGet',
            payload: {

            }
        };
        ws.onopen = (event) => {
            ws.send(encodeToWs(message));
            ws.onmessage = (event) => {
                if (event.data === "close") {
                    ws.close();
                } else {
                    const data = JSON.parse(unescape(event.data));
                    const {memoTitle, memoContent, published} = data;
                    this.setState({
                        memoTitle, memoContent, published
                    });
                }
            }
            ws.onerror = (event) => {
                ws.close();
            }
        }
    }

    saveButtonClicked = (event) => {
        if (!Boolean(sessionStorage[`${process.env.REACT_APP_APP_NAME}.logged`])) {
            alert('로그인이 필요한 서비스입니다.');
            return;
        }

        const {memoTitle, memoContent, published} = this.state;
        if (published === null) {
            alert('글이 있어야 합니다.');
            return;
        }
        
        const userId = sessionStorage[`${process.env.REACT_APP_APP_NAME}.userId`];
        const platform = sessionStorage[`${process.env.REACT_APP_APP_NAME}.platform`];
        const memoId = `${platform}${userId}_${published}`;

        const message = {
            type: 'saveYours',
            payload: {
                memoId, memoTitle, memoContent,
                published: datetimeToMysql(published)
            }
        };

        const ws = new WebSocket(process.env.REACT_APP_SERVER_SOCKET_URL);
        ws.onopen = (event) => {
            ws.send(encodeToWs(message));
            ws.onmessage = (event) => {
                if (event.data === 'close') {
                    ws.close();
                }
            }
            ws.onerror = (event) => {
                ws.close();
            }
        }
    }

    render() {
        const style = {
            diaryPage: {
                height: String(window.innerHeight-142)+"px"
            }
        }
        return(
            <div className="diaryPage" style={style.diaryPage}>
                <div>
                    <pre>{this.state.memoTitle}</pre>
                    <pre>{this.state.memoContent}</pre>
                    <pre>{this.state.published}</pre>
                </div>
                <button onClick={this.getDiary}>가져오기</button>
                <button onClick={this.saveButtonClicked}>저장</button>
            </div>
        )
    }
}

export default OtherDiary;