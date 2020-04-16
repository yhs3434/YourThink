import React, {Component} from 'react';
import './css/WriteDiary.css';
import {openDB, getObjectStore} from '../lib/indexeddb';
import {withRouter} from 'react-router-dom';
import {convertDatetime} from '../lib/datetime';

class WriteDiary extends Component {
    state = {
        memoTitle: '',
        memoContent: '',
        autoSaveInterval: null
    }
    
    componentDidMount() {
        if (this.isAutoSave()) {
            const result = window.confirm(`작성 중이던 글이 존재합니다.
계속 작성 하시겠습니까?
            `);
            if (result) {
                this.setState(this.getAutoSave());
            } else {
                this.autoSaveRemove();
            }
        }
        const autoSaveInterval = window.setInterval(this.autoSave, 5000);
        this.setState({
            autoSaveInterval: autoSaveInterval
        });
    }

    componentWillUnmount() {
        window.clearInterval(this.state.autoSaveInterval);
        this.setState({autoSaveInterval: null});
    }

    handleChange = (event) => {
        this.setState({
            [event.currentTarget.name] : event.currentTarget.value
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const superthis = this;
        const obj = {
            memoTitle: this.state.memoTitle,
            memoContent: this.state.memoContent,
            published: convertDatetime('init'),
            modified: convertDatetime('init'),
            ispublic: false,
            publicTime: null
        };
        const db = await openDB();
        const objectStore = getObjectStore(db, 'readwrite');
        let req;
        try {
            req = objectStore.add(obj);
            
        } catch (e) {}
        req.onsuccess = (evt) => {
            this.autoSaveRemove();
            superthis.props.history.replace('/my');
            console.log('입력 완료');
        }
        req.onerror = () => {
            console.error(this.error);
        }
    }

    autoSave = (event) => {
        if (this.state.memoTitle) {
            window.localStorage[`${process.env.REACT_APP_APP_NAME}.auto.memoTitle`] = this.state.memoTitle;
        }
        if (this.state.memoContent) {
            window.localStorage[`${process.env.REACT_APP_APP_NAME}.auto.memoContent`] = this.state.memoContent;
        }
    }

    autoSaveRemove = (event) => {
        window.localStorage[`${process.env.REACT_APP_APP_NAME}.auto.memoTitle`] = '';
        window.localStorage[`${process.env.REACT_APP_APP_NAME}.auto.memoContent`] = '';
    }

    getAutoSave = (event) => {
        const obj = {
            memoTitle: window.localStorage[`${process.env.REACT_APP_APP_NAME}.auto.memoTitle`],
            memoContent: window.localStorage[`${process.env.REACT_APP_APP_NAME}.auto.memoContent`]
        };
        return obj;
    }

    isAutoSave = (event) => {
        if (Boolean(window.localStorage[`${process.env.REACT_APP_APP_NAME}.auto.memoTitle`]) || Boolean(window.localStorage[`${process.env.REACT_APP_APP_NAME}.auto.memoContent`])){
            return true
        } else {
            return false
        }
    }

    render() {
        const style = {
            p: {
                marginTop: '2rem',
                marginBottom: '2rem'
            }
        }
        return(
            <form className="writeDiaryWrap" onSubmit={this.handleSubmit}>
                <p style={style.p}>
                    지금 이 순간 당신의 생각을 적어주세요
                </p>
                <input
                    className="writeDiaryTitle"
                    name="memoTitle"
                    autoFocus
                    onChange={this.handleChange}
                    value={this.state.memoTitle}
                    placeholder="제목"
                />
                <textarea 
                    className="writeDiaryTextArea"
                    name="memoContent"
                    rows = "40"
                    onChange = {this.handleChange}
                    value = {this.state.memoContent}
                />
                <button type='submit'>완료</button>
            </form>
        )
    }
}

export default withRouter(WriteDiary);