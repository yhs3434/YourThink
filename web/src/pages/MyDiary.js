import React, {Component} from 'react';
import './css/MyDiary.css';

class MyDiary extends Component {
    state = {
        memos: [],
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
        let superthis = this;
        req.onsuccess = function (evt) {
            const cursor = evt.target.result;
            if (cursor) {
                req = store.get(cursor.key);
                req.onsuccess = function (evt) {
                    const value = evt.target.result;
                    superthis.setState({
                        memos: superthis.state.memos.concat(value)
                    });
                }
                cursor.continue();
            }
        }
    }

    render() {
        return(
            <div className="myDiaryWrap">
                This is My Diary page.
                <ol>
                    {
                        this.state.memos.map((memo, i) => {
                            return(
                                <li>{memo.memoTitle}</li>
                            )
                        })
                    }
                </ol>
            </div>
        )
    }
}

export default MyDiary;