import React, {Component} from 'react';
import {openDB, getObjectStore} from '../lib/indexeddb';
import {withRouter} from 'react-router-dom';
import Oauth from '../components/oauth.js';

class DetailDiary extends Component {
    state = {
        memoTitle: undefined,
        memoContent: undefined,
        published: undefined,
        
        memoId: undefined,

        modalOauth: false,
    }

    async componentDidMount() {
        const id = Number(this.props.match.params.id);
        this.setState({
            memoId: id
        });
        
        const db = await openDB();
        let objectStore = getObjectStore(db, 'readonly');
        let request = objectStore.get(id);
        request.onerror = (event) => {
            console.log('가져오기 실패');
        }
        request.onsuccess = (event) => {
            console.log('가져오기 성공');
            //console.log(request.result);
            if (Boolean(request.result)) {
                this.setState({
                    memoTitle: request.result.memoTitle,
                    memoContent: request.result.memoContent,
                    published: request.result.published
                });
            }
        }
    }

    modalOpen = (event) => {
        this.setState({
            modalOauth: true
        });
    }

    modalClose = (event) => {
        this.setState({
            modalOauth: false
        });
    }

    deleteButtonClicked = async (event) => {
        const result = window.confirm("정말 삭제 하시겠습니까?");
        const superthis = this;
        if (Boolean(this.state.memoTitle) && result) {
            const db = await openDB();
            let objectStore = getObjectStore(db, 'readwrite');
            let request = objectStore.delete(this.state.memoId);
            request.onsuccess = function(event) {
                superthis.props.history.replace('/my');
                console.log('delete success');
            };
            request.onerror = function(event) {
                console.log('delete fail');
            };
        } else {
            console.log('not delete');
        }
    }

    modifyButtonClicked = (event) => {
        const result = window.confirm("수정 하시겠습니까?");
        
        if (Boolean(this.state.memoTitle) && result) {
            this.props.history.replace(`/modify/${this.state.memoId}`);
        } else {
            console.log('not modify');
        }
    }

    saveButtonClicked = async (event) => {
        //const result = window.confirm("저장 하시겠습니까?");  
        if (!Boolean(sessionStorage[`${process.env.REACT_APP_APP_NAME}.logged`])) {
            alert('로그인이 필요한 서비스입니다.')
            return
        }

        if (Boolean(this.state.memoTitle) && Boolean(sessionStorage[`${process.env.REACT_APP_APP_NAME}.userId`])) {
            const id = Number(this.props.match.params.id);
            const userId = sessionStorage[`${process.env.REACT_APP_APP_NAME}.userId`];
            const platform = sessionStorage[`${process.env.REACT_APP_APP_NAME}.platform`];
            const db = await openDB();
            let objectStore = getObjectStore(db, 'readonly');
            let request = objectStore.get(id);
            request.onsuccess = (event) => {
                const {memoTitle, memoContent, published} = request.result;
                const memoId = `${platform}${userId}_${published}`;
                const obj = {
                    memoId, memoTitle, memoContent, published
                };
                console.log('reqObj', obj);
                const message = {
                    type: 'save',
                    payload: obj
                };
                // 임시 주소
                const ws = new WebSocket(process.env.REACT_APP_SERVER_SOCKET_URL);
                ws.onopen = (event) => {
                    ws.send(escape(JSON.stringify(message)));
                }
                ws.onmessage = (event) => {
                    const {data} = event;
                    switch (data) {
                        case "success":
                            ws.close();
                            break;
                        case "fail":
                            ws.close();
                            break;
                    }
                    
                }
                ws.onclose = (event) => {
                    console.log('closed');
                }
            }
        } else {
            console.log('not save');
        }
    }

    publicButtonClicked = async (event) => {
        console.log('공개');
        const db = await openDB();
        const objectStore = getObjectStore(db, 'readonly');
        const request = objectStore.get(this.state.memoId);
        request.onsuccess = (event) => {
            const {memoTitle, memoContent, published} = request.result;
            const obj = {
                memoTitle, memoContent, published
            };
            const message = {
                type: 'public',
                payload: obj
            };
            const ws = new WebSocket(process.env.REACT_APP_SERVER_SOCKET_URL);
            ws.onopen = (event) => {
                ws.send(escape(JSON.stringify(message)));
                ws.close();
            }
            ws.onerror = (event) => {
                ws.close();
            }
        }
    }

    loginModalControl = (event) => {
        if (this.state.modalOauth) {
            this.modalClose();
        } else {
            this.modalOpen();
        }
    }

    render() {
        const style = {
            wrap: {
                display: 'flex',
                flexDirection: 'column',
                width: '80%',
                alignItems: 'center'
            },
            titleWrap: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center'
            },
            contentWrap: {
                whiteSpace: 'pre-wrap'
            },
            title: {
                alignSelf: 'center',
                fontSize: 20
            }
        }

        return (
            <div>
                <div style={style.wrap}>
                    <pre><span style={style.title}>{this.state.memoTitle}</span></pre>
                    <pre style={style.contentWrap}>{this.state.memoContent}</pre>
                    <pre>{this.state.published}</pre>
                    <div>
                        <button onClick={this.publicButtonClicked}>공개</button>
                        <button onClick={this.saveButtonClicked}>저장</button>
                        <button onClick={this.modifyButtonClicked}>수정</button>
                        <button onClick={this.deleteButtonClicked}>삭제</button>
                    </div>
                    
                </div>
                <div className={this.state.modalOauth
                    ?"modal_component_visible"
                    :"modal_component_hide"
                }>
                    <Oauth 
                        modalOpen={this.modalOpen}
                        modalClose={this.modalClose}
                        setKakaoId={this.props.setKakaoId}
                    />
                </div>
            </div>
        )
    }
}

export default withRouter(DetailDiary);