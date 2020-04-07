import React, {Component, Fragment} from 'react';
import './css/MyDiary.css';
import {openDB, getObjectStore} from '../lib/indexeddb';
import {Link} from "react-router-dom";
import MyLi from '../components/MyLi';
import {withRouter} from 'react-router-dom';
import {moreAuto} from '../lib/scroll';

class MyDiary extends Component {
    state = {
        memos: [],
        memoOffset: 5,
        delim: 5
    }

    async componentDidMount() {
        this.getAllData();
        moreAuto(this.moreButtonClicked);
        window.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
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

    moreButtonClicked = (event) => {
        this.setState({
            memoOffset: this.state.memoOffset + this.state.delim
        });
    }

    onScroll = (event) => {
        moreAuto(this.moreButtonClicked);
    }

    render() {
        const style = {
            btnWrite: {
                marginTop: '20px',
                marginBottom: '20px'
            }
        }
        return(
            <div className="myDiaryWrap">
                <div>
                    <button className="button-write" onClick={this.writeButtonClicked}
                        style={style.btnWrite}
                    >글 쓰기</button>
                </div>
                <div className="li-list">
                    {
                        this.state.memos.slice(0, this.state.memoOffset).map((memo, idx) => {
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
                {   /*
                    <div>
                        <button onClick={this.moreButtonClicked}>더 보기</button>
                    </div>
                    */
                }
            </div>
        )
    }
}

export default withRouter(MyDiary);