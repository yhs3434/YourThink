import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {encodeToWs, decodeFromWs} from '../lib/websocket';
import MyLi from '../components/MyLi';
import {convertDatetime} from '../lib/datetime';

class SaveDiary extends Component {
    state = {
        memos: []
    }

    componentDidMount() {
        if (!Boolean(sessionStorage[`${process.env.REACT_APP_APP_NAME}.logged`])) {
            alert('로그인이 필요한 서비스입니다.');
            this.props.history.replace('/');
        } else {
            const mode = this.props.match.params.mode;
            if (mode === 'mine') {
                this.getMine();
            } else if (mode === 'yours') {
                this.getYours();
            }
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
                const data = decodeFromWs(event.data);
                if (data === 'close'){
                    console.log('close');
                    ws.close();
                } else {
                    let memo = {
                        memoTitle: data.memoTitle,
                        memoContent: data.memoContent,
                        published: convertDatetime(data.published)
                    };
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
                    let memo = {
                        memoTitle: data.memoTitle,
                        memoContent: data.memoContent,
                        published: convertDatetime(data.published)
                    };
                    this.setState({
                        memos: [memo, ...this.state.memos]
                    });
                }
            }
        }
    }

    memoClicked = (event) => {
        const memo = this.state.memos[event.currentTarget.dataset.idx];
        const {setMemoTitle, setMemoContent, setPublished} = this.props;
        setMemoTitle(memo['memoTitle']);
        setMemoContent(memo['memoContent']);
        setPublished(memo['published']);
        this.props.history.push('/detailyours');
    }

    render() {
        return (
            <div className="li-list">
            {
                this.state.memos.map((memo, idx) => {
                    return (
                        <div key={idx} data-idx={idx} onClick={this.memoClicked}>
                            <MyLi
                                memoTitle = {memo.memoTitle}
                                memoContent = {memo.memoContent}
                                published = {memo.published}
                            />
                        </div>
                    )
                })
            }
            </div>
        )
    }
}

export default withRouter(SaveDiary);