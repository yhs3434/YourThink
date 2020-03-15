import React, {Component} from 'react';
import {openDB} from '../lib/indexeddb';
import {withRouter} from 'react-router-dom';

class DetailDiary extends Component {
    state = {
        memoTitle: undefined,
        memoContent: undefined,
        published: undefined,
        
        memoId: undefined,

        db: undefined,
        DB_NAME: undefined,
        DB_VERSION: undefined,
        DB_STORE_NAME: undefined
    }

    async componentDidMount() {
        const id = Number(this.props.match.params.id);
        this.setState({
            memoId: id
        });
        
        const ret = await openDB();
        this.setState({
            db: ret,
            DB_NAME: ret.name,
            DB_VERSION: ret.version,
            DB_STORE_NAME: ret.objectStoreNames[0]
        });

        let objectStore = this.getObjectStore(this.state.DB_STORE_NAME, 'readonly');
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

    deleteButtonClicked = (event) => {
        const result = window.confirm("정말 삭제 하시겠습니까?");
        const superthis = this;
        if (Boolean(this.state.memoTitle) && result) {
            let objectStore = this.getObjectStore(this.state.DB_STORE_NAME, 'readwrite');
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

    saveButtonClicked = (event) => {
        const result = window.confirm("저장 하시겠습니까?");

        if (Boolean(this.state.memoTitle) && result) {
            alert('준비중입니다');
        } else {
            console.log('not save');
        }
    }

    getObjectStore = (store_name, mode) => {
        if (Boolean(this.state.db)) {
            let db = this.state.db;
            return db.transaction(store_name, mode).objectStore(store_name);
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
            <div style={style.wrap}>
                <pre><span style={style.title}>{this.state.memoTitle}</span></pre>
                <pre style={style.contentWrap}>{this.state.memoContent}</pre>
                <pre>{this.state.published}</pre>
                <div>
                    <button onClick={this.saveButtonClicked}>저장</button>
                    <button onClick={this.modifyButtonClicked}>수정</button>
                    <button onClick={this.deleteButtonClicked}>삭제</button>
                </div>
            </div>
        )
    }
}

export default withRouter(DetailDiary);