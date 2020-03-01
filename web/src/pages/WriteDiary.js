import React, {Component} from 'react';
import './css/WriteDiary.css';

class WriteDiary extends Component {
    state = {
        memoTitle: '',
        memoContent: '',
        DATABASE: 'OthersThink',
        DB_VERSION: 1,
        DB_STORE_NAME: 'memo',
        db: undefined
    }
    
    componentDidMount() {
        this.openDB();
    }

    openDB = () => {
        let req = indexedDB.open(this.state.DATABASE, this.state.DB_VERSION);
        req.onsuccess = (evt) => {
            this.setState({
                db: evt.target.result
            })
            this.getAllData();
        };
        req.onerror = (evt) => {
            console.error("indexedDB : ", evt.target.errorCode);
        };
        req.onupgradeneeded = (evt) => {
            let store = evt.currentTarget.result.createObjectStore(this.state.DB_STORE_NAME,
                {keyPath: 'id', autoIncrement: true});
            store.createIndex('memoTitle', 'memoTitle', {unique: false});
            store.createIndex('memoContent', 'memoContent', {unique: false});
        }
    }

    // store 반환
    getObjectStore = (store_name, mode) => {
        if (Boolean(this.state.db)) {
            let db = this.state.db;
            return db.transaction(store_name, mode).objectStore(store_name);
        }
    }

    getAllData = () => {
        // get
        let store = this.getObjectStore(this.state.DB_STORE_NAME, 'readonly');
        let req = store.openCursor();
        req.onsuccess = function (evt) {
            const cursor = evt.target.result;
            if (cursor) {
                req = store.get(cursor.key);
                req.onsuccess = function (evt) {
                    const value = evt.target.result;
                    console.log(value)
                }
                cursor.continue();
            }
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
        console.log(obj);
        let store = this.getObjectStore(this.state.DB_STORE_NAME, 'readwrite');
        let req;
        console.log(store)
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