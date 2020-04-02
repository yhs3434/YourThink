import React, {Component, Fragment} from 'react';
import './css/MyDiary.css';
import {openDB, getObjectStore} from '../lib/indexeddb';
import {Link} from "react-router-dom";
import MyLi from '../components/MyLi';
import {withRouter} from 'react-router-dom';

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
                    const memo = evt.target.result;
                    superthis.setState({
                        memos: [memo, ...superthis.state.memos]
                    });
                }
                cursor.continue();
            }
        }
    }

    memoClicked = (event) => {
        const memo = this.state.memos[event.currentTarget.dataset.idx];
        const {setMemoId, setMemoTitle, setMemoContent, setPublished} = this.props;
        setMemoId(memo.id);
        setMemoTitle(memo.memoTitle);
        setMemoContent(memo.memoContent);
        setPublished(memo.published);
        this.props.history.push('./detail');
    }

    writeButtonClicked = (event) => {
        this.props.history.push('/writeDiary');
    }

    render() {
        const style = {
        }
        return(
            <div className="myDiaryWrap">
                <div>
                    <button className="button-write" onClick={this.writeButtonClicked}>글 쓰기</button>
                </div>
                <div className="li-list">
                    {
                        this.state.memos.map((memo, idx) => {
                            return(
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
            </div>
        )
    }
}

export default withRouter(MyDiary);