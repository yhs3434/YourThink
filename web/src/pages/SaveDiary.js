import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {encodeToWs, decodeFromWs} from '../lib/websocket';
import MyLi from '../components/MyLi';
import {convertDatetime} from '../lib/datetime';
import {moreAuto} from '../lib/scroll';

class SaveDiary extends Component {
    state = {
        memos: [],
        memoOffset: 5,
        delim: 5
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
        moreAuto(this.moreButtonClicked);
        window.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
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

    moreButtonClicked = (event) => {
        this.setState({
            memoOffset: this.state.memoOffset + this.state.delim
        });
    }

    onScroll = (event) => {
        moreAuto(this.moreButtonClicked);
    }

    render() {
        return (
            <div>
                <div className="li-list">
                {
                    this.state.memos.slice(0, this.state.memoOffset).map((memo, idx) => {
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
                <div>
                    <button onClick={this.moreButtonClicked}>더 보기</button>
                </div>
            </div>
        )
    }
}

export default withRouter(SaveDiary);