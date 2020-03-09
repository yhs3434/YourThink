import React, {Component} from 'react';
import './css/WriteDiary.css';
import {openDB} from '../lib/indexeddb';

class WriteDiary extends Component {
    state = {
        memoTitle: '',
        memoContent: '',
        db: undefined,
        DB_NAME: undefined,
        DB_VERSION: undefined,
        DB_STORE_NAME: undefined
    }
    
    async componentDidMount() {
        const ret = await openDB();
        this.setState({
            db: ret,
            DB_NAME: ret.name,
            DB_VERSION: ret.version,
            DB_STORE_NAME: ret.objectStoreNames[0]
        });
    }

    // store 반환
    getObjectStore = (store_name, mode) => {
        if (Boolean(this.state.db)) {
            let db = this.state.db;
            return db.transaction(store_name, mode).objectStore(store_name);
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.currentTarget.name] : event.currentTarget.value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const obj = {
            memoTitle: this.state.memoTitle,
            memoContent: this.state.memoContent
        };
        let store = this.getObjectStore(this.state.DB_STORE_NAME, 'readwrite');
        let req;
        try {
            req = store.add(obj);
            
        } catch (e) {}
        req.onsuccess = (evt) => {
            console.log('입력 완료');
        }
        req.onerror = () => {
            console.error(this.error);
        }
        
    }

    render() {
        return(
            <form className="writeDiaryWrap" onSubmit={this.handleSubmit}>
                This is Write Diary page.
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

export default WriteDiary;