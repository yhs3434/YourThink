import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {encodeToWs, decodeFromWs} from '../lib/websocket';

class SaveDiary extends Component {
    state = {
        memos: []
    }

    componentDidMount() {
        if (!Boolean(sessionStorage[`${process.env.REACT_APP_APP_NAME}.logged`])) {
            alert('로그인이 필요한 서비스입니다.');
            this.props.history.replace('/');
        } else {
            
        }

    }

    getMine = () => {
        this.setState({
            memos: []
        });

        const ws = new WebSocket(process.env.REACT_APP_SERVER_SOCKET_URL);
        ws.onopen = () => {
            const message = {
                type: 'getMine',
                payload: {
                    userId: sessionStorage[`${process.env.REACT_APP_APP_NAME}.userId`],
                    platform: sessionStorage[`${process.env.REACT_APP_APP_NAME}.platform`]
                }
            };
            ws.send(encodeToWs(message));
            ws.onmessage = (event) => {
                if (event.data === 'close'){
                    console.log('close');
                    ws.close();
                } else {
                    let memo = decodeFromWs(event.data)
                    this.setState({
                        memos: [memo ,...this.state.memos]
                    });
                }
            }
        }
    }

    getYours = () => {
        this.setState({
            memos: []
        });

        const ws = new WebSocket(process.env.REACT_APP_SERVER_SOCKET_URL);
        ws.onopen = () => {
            const message = {
                type: 'getYours',
                payload: {
                    userId: sessionStorage[`${process.env.REACT_APP_APP_NAME}.userId`],
                    platform: sessionStorage[`${process.env.REACT_APP_APP_NAME}.platform`]
                }
            };
            ws.send(encodeToWs(message));
            ws.onmessage = (event) => {
                const data = decodeFromWs(event.data);
                if (data === 'close'){
                    console.log('close');
                    ws.close();
                } else {
                    let memo = data;
                    this.setState({
                        memos: [memo, ...this.state.memos]
                    });
                }
            }
        }
    }

    render() {
        return (
            <div>
                <ul>
                    {
                        this.state.memos.map((memo, idx) => {
                            return (
                                <li key={idx}>{idx} {memo.memoTitle} {memo.published}</li>
                            )
                        })
                    }
                </ul>
                <button onClick={this.getMine}>나의 메모</button>
                <button onClick={this.getYours}>너의 메모</button>
            </div>
        )
    }
}

export default withRouter(SaveDiary);