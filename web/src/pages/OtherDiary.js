import React, {Component} from 'react';
import './css/OtherDiary.css';
import {encodeToWs, decodeFromWs} from '../lib/websocket';
import {datetimeToMysql} from '../lib/mysql';
import {convertDatetime} from '../lib/datetime';

class OtherDiary extends Component {
    state = {
        memoTitle: null,
        memoContent: null,
        published: null,
        modified: null
    }

    componentDidMount() {
        this.getDiary();
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
                    const data = decodeFromWs(event.data);
                    let {memoTitle, memoContent, published, modified} = data;
                    published = convertDatetime(published);
                    modified = convertDatetime(modified);
                    this.setState({
                        memoTitle, memoContent, published, modified
                    });
                    console.log('published', published);
                    console.log('modified', modified);
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

        const {memoTitle, memoContent, published, modified} = this.state;
        if (published === null) {
            alert('글이 있어야 합니다.');
            return;
        }
        
        const userId = sessionStorage[`${process.env.REACT_APP_APP_NAME}.userId`];
        const platform = sessionStorage[`${process.env.REACT_APP_APP_NAME}.platform`];
        const memoId = `${platform}${userId}_${modified}`;

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
                minHeight: String(window.innerHeight-142)+"px"
            },
            btn: {
                marginBottom: '5px',
            }
        }
        return(
            <div className="diaryPage" style={style.diaryPage}>
                <div>
                    <pre className="diary-memoTitle">{this.state.memoTitle}</pre>
                    <pre className="diary-memoContent">{this.state.memoContent}</pre>
                    <pre className="diary-published">{this.state.published}</pre>
                </div>
                <button onClick={this.getDiary} style={style.btn}>다음 글</button>
                <button onClick={this.saveButtonClicked} style={style.btn}>저장</button>
            </div>
        )
    }
}

export default OtherDiary;