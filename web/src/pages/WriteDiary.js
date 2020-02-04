import React, {Component} from 'react';
import './css/WriteDiary.css';

class WriteDiary extends Component {
    state = {
        textarea: ''
    }
    
    handleChange = (event) => {
        this.setState({
            [event.currentTarget.name] : [event.currentTarget.value]
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        alert(this.state.textarea);
    }

    render() {
        return(
            <form className="writeDiaryWrap" onSubmit={this.handleSubmit}>
                This is Write Diary page.
                <textarea 
                    className="writeDiaryTextArea"
                    name="textarea"
                    autoFocus
                    rows = "40"
                    onChange = {this.handleChange}
                    value = {this.state.textarea}
                />
                <button type='submit'>완료</button>
            </form>
        )
    }
}

export default WriteDiary;