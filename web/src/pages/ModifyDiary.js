import React, {Component} from 'react';
import {openDB, getObjectStore} from '../lib/indexeddb';
import {withRouter} from 'react-router-dom';
import {convertDatetime} from '../lib/datetime';

class ModifyDiary extends Component {
    state = {
        memoTitle: '',
        memoContent: '',

        memoId: undefined,
    }

    async componentDidMount() {
        const id = Number(this.props.match.params.id);
        this.setState({
            memoId: id
        });
        
        const db = await openDB();
        let objectStore = getObjectStore(db, 'readonly');
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

    handleChange = (event) => {
        this.setState({
            [event.currentTarget.name]: event.currentTarget.value
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const superthis = this;
        const obj = {
            memoTitle: this.state.memoTitle,
            memoContent: this.state.memoContent,
            published: this.state.published
        };
        const db = await openDB();
        const objectStore = getObjectStore(db, 'readwrite');
        let request = objectStore.get(this.state.memoId);
        request.onsuccess = (event) => {
            let data = event.target.result;
            data.memoTitle = this.state.memoTitle;
            data.memoContent = this.state.memoContent;
            data.modified = convertDatetime('init');

            let requestUpdate = objectStore.put(data);
            requestUpdate.onerror = function(event) {
                console.log('수정 실패');
            }
            requestUpdate.onsuccess = function(event) {
                console.log('수정 완료');
                superthis.props.history.replace('/my');
            }
        }
        request.onerror = (event) => {
            console.error(this.error);
        }
        
    }

    render() {
        return(
            <form className="writeDiaryWrap" onSubmit={this.handleSubmit}>
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
                    placeholder="내용"
                />
                <button type='submit'>완료</button>
            </form>
        )
    }
}

export default withRouter(ModifyDiary);