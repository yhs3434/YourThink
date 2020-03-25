import React, {Component} from 'react';
import './css/MyDiary.css';
import {openDB, getObjectStore} from '../lib/indexeddb';
import {Link} from "react-router-dom";

class MyDiary extends Component {
    state = {
        memos: []
    }

    async componentDidMount() {
        this.getAllData();
    }

    getAllData = async () => {
        // get
        const db = await openDB();
        const objectStore = getObjectStore(db, 'readonly');
        let req = objectStore.openCursor();
        let superthis = this;
        req.onsuccess = function (evt) {
            const cursor = evt.target.result;
            if (cursor) {
                req = objectStore.get(cursor.key);
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
                <div>
                    <Link to='/writeDiary'>글 쓰기</Link>
                </div>
                <div>
                    <ul>
                        {
                            this.state.memos.map((memo, i) => {
                                return(
                                    <li>
                                        <Link to={`/detail/${memo.id}`} params={{id: memo.id}}>
                                            {memo.memoTitle} {memo.published}
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

export default MyDiary;