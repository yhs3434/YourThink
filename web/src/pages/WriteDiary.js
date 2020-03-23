import React, {Component} from 'react';
import './css/WriteDiary.css';
import {openDB, getObjectStore} from '../lib/indexeddb';
import {withRouter} from 'react-router-dom';

class WriteDiary extends Component {
    state = {
        memoTitle: '',
        memoContent: ''
    }
    
    async componentDidMount() {
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
            published: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
        const db = await openDB();
        const objectStore = getObjectStore(db, 'readwrite');
        let req;
        try {
            req = objectStore.add(obj);
            
        } catch (e) {}
        req.onsuccess = (evt) => {
            superthis.props.history.replace('/my');
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

export default withRouter(WriteDiary);