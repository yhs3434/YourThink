import React, {Component, Fragment} from 'react';
import './css/MyDiary.css';
import {openDB, getObjectStore} from '../lib/indexeddb';
import {Link} from "react-router-dom";
import MyLi from '../components/MyLi';

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
        const style = {
            ul: {
                width: '100%'
            }
        }
        return(
            <div className="myDiaryWrap">
                <div>
                    <Link className="button-common" to='/writeDiary'>글 쓰기</Link>
                </div>
                <Fragment>
                    {
                        this.state.memos.map((memo, i) => {
                            return(
                                <MyLi
                                    memoTitle = {memo.memoTitle}
                                    memoContent = {memo.memoContent}
                                    published = {memo.published}
                                />
                            )
                            {
                                //<Link to={`/detail/${memo.id}`} params={{id: memo.id}} />
                            }
                        })
                    }
                </Fragment>
            </div>
        )
    }
}

export default MyDiary;