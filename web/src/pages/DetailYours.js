import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

class DetailYours extends Component {
    render() {
        return (
            <div className="diaryPage">
                <div>
                    <h3>제목</h3>
                    <pre>{this.props.memoTitle}</pre>
                    <h3>내용</h3>
                    <pre>{this.props.memoContent}</pre>
                    <h3>날짜</h3>
                    <pre>{this.props.published}</pre>
                </div>
            </div>
        )
    }
}

export default withRouter(DetailYours);