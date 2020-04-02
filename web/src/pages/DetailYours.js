import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

class DetailYours extends Component {
    render() {
        const style = {
            diaryPage: {
                minHeight: String(window.innerHeight-142)+"px"
            }
        }
        return (
            <div className="diaryPage" style={style.diaryPage}>
                <div>
                    <pre className="diary-memoTitle">{this.props.memoTitle}</pre>
                    <pre className="diary-memoContent">{this.props.memoContent}</pre>
                    <pre className="diary-published">{this.props.published}</pre>
                </div>
            </div>
        )
    }
}

export default withRouter(DetailYours);