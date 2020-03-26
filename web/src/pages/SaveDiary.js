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

    getMineMemo = () => {
        this.setState({
            memos: []
        });

        const ws = new WebSocket(process.env.REACT_APP_SERVER_SOCKET_URL);
        ws.onopen = () => {
            const payload = {
                userId: sessionStorage[`${process.env.REACT_APP_APP_NAME}.userId`],
                platform: sessionStorage[`${process.env.REACT_APP_APP_NAME}.platform`]
            };
            const message = {
                type: 'getMine',
                payload
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
                <button onClick={this.getMineMemo}>테스트</button>
            </div>
        )
    }
}

export default withRouter(SaveDiary);