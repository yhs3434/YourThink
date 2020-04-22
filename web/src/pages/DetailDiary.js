import React, {Component, Fragment} from 'react';
import {openDB, getObjectStore} from '../lib/indexeddb';
import {withRouter} from 'react-router-dom';
import {encodeToWs, decodeFromWs} from '../lib/websocket';
import {convertDatetime} from '../lib/datetime';

class DetailDiary extends Component {
    state = {
        memoId: undefined,

        modalOauth: false,
        publicTime: null,
        refresh: false
    }

    componentDidMount() {
        this.dateGap();
    }

    componentDidUpdate() {
        if (this.state.refresh == true) {
            this.dateGap();
        }
    }

    dateGap = async () => {
        function dateDiff(_prevDate, _nextDate) {
            let prevDate = _prevDate instanceof Date ? _prevDate : new Date(_prevDate);
            let nextDate = _nextDate instanceof Date ? _nextDate : new Date(_nextDate);
    
            prevDate = new Date(prevDate.getFullYear(), prevDate.getMonth()+1, prevDate.getDate());
            nextDate = new Date(nextDate.getFullYear(), nextDate.getMonth()+1, nextDate.getDate());
    
            let dateGap = Math.abs(nextDate.getTime() - prevDate.getTime());
            dateGap = Math.ceil(dateGap / (1000 * 3600 * 24));
    
            return dateGap;
        };

        const memoId = this.props.memoId || false;
        const db = await openDB();
        const objectStore = getObjectStore(db, 'readonly');

        if (memoId) {
            const getRequest = objectStore.get(memoId);
            getRequest.onsuccess = (event) => {
                const memoData = event.target.result;
                const dayGap = dateDiff(memoData.publicTime, new Date());
                if (dayGap > 30) {
                    this.setState({
                        publicTime: null,
                        refresh: false
                    });
                } else {
                    this.setState({
                        publicTime: memoData.publicTime,
                        refresh: false
                    });
                }
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
        if (result && Boolean(this.props.memoTitle)) {
            const db = await openDB();
            let objectStore = getObjectStore(db, 'readwrite');
            let request = objectStore.delete(this.props.memoId);
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
        
        if (result && Boolean(this.props.memoTitle)) {
            this.props.history.replace(`/modify/${this.props.memoId}`);
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

        if (Boolean(this.props.memoTitle) && Boolean(sessionStorage[`${process.env.REACT_APP_APP_NAME}.userId`])) {
            const id = Number(this.props.memoId);
            const userId = sessionStorage[`${process.env.REACT_APP_APP_NAME}.userId`];
            const platform = sessionStorage[`${process.env.REACT_APP_APP_NAME}.platform`];
            const db = await openDB();
            let objectStore = getObjectStore(db, 'readonly');
            let request = objectStore.get(id);
            request.onsuccess = (event) => {
                const {memoTitle, memoContent, published, modified} = request.result;
                const memoId = `${platform}${userId}_${modified}`;
                const obj = {
                    memoId, memoTitle, memoContent, published
                };
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
                    window.alert('[저장한 나의 글]에 저장되었습니다.');
                    
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
        if (!Boolean(this.props.memoId)) {
            return;
        }
        const self = this;
        const db = await openDB();
        const objectStore = getObjectStore(db, 'readonly');
        const request = objectStore.get(this.props.memoId);
        request.onsuccess = (event) => {
            let memoData = request.result;
            const {memoTitle, memoContent, published, modified} = request.result;
            const obj = {
                memoTitle, memoContent, published, modified
            };
            const message = {
                type: 'public',
                payload: obj
            };
            const ws = new WebSocket(process.env.REACT_APP_SERVER_SOCKET_URL);
            ws.onopen = (event) => {
                ws.send(encodeToWs(message));
            };
            ws.onmessage = (event) => {
                const data = decodeFromWs(event.data);
                if (data === 'success') {
                    window.alert("[너의 생각]에 30일간 공개되었습니다.");
                    memoData.publicTime = convertDatetime('init');
                    const objectStoreUpdate = getObjectStore(db, 'readwrite');
                    let requestUpdate = objectStoreUpdate.put(memoData);
                    requestUpdate.onerror = function(event) {
                        console.log('퍼블릭 타임 갱신 실패');
                    }
                    requestUpdate.onsuccess = function(event) {
                        console.log('퍼블릭 타임 갱신 완료');
                    }
                } else if (data === 'error') {
                    window.alert("공개 오류");
                }
                ws.close();
                self.setState({
                    refresh: true
                });
            };
            ws.onerror = (event) => {
                ws.close();
            };
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
            },
            diaryPage: {
                minHeight: String(window.innerHeight-142)+"px"
            },
            btn: {
                marginLeft: '5px',
                marginRight: '5px'
            },
            btnPublic: {
                marginLeft: '5px',
                marginRight: '5px',
                marginBottom: '5px',
                width: '212px'
            },
            btnPublicNone: {
                marginLeft: '5px',
                marginRight: '5px',
                marginBottom: '5px',
                width: '212px',
                backgroundColor: 'gray'
            }
        }
        return (
            <Fragment>
                <div style={style.wrap} className="diaryPage" style={style.diaryPage}>
                    <div>
                        <pre className="diary-memoTitle">{this.props.memoTitle}</pre>
                        <pre className="diary-memoContent">{this.props.memoContent}</pre>
                        <pre className="diary-published">{this.props.published}</pre>
                    </div>
                    <div>
                        <div>
                            <button onClick={this.state.publicTime ? ()=>{} : this.publicButtonClicked} 
                                style={this.state.publicTime ? style.btnPublicNone : style.btnPublic}
                            >다른 사람에게 공개</button>
                        </div>
                        <div>
                            <button onClick={this.saveButtonClicked} style={style.btn}>저장</button>
                            <button onClick={this.modifyButtonClicked} style={style.btn}>수정</button>
                            <button className="btn-del" onClick={this.deleteButtonClicked} style={style.btn}>삭제</button>
                        </div>
                    </div>
                    
                </div>
            </Fragment>
        )
    }
}

export default withRouter(DetailDiary);