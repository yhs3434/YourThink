import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

class DetailYours extends Component {
    render() {
        const style = {
            diaryPage: {
                height: String(window.innerHeight-142)+"px"
            }
        }
        return (
            <div className="diaryPage" style={style.diaryPage}>
                <div>
                    <pre>{this.props.memoTitle}</pre>
                    <pre>{this.props.memoContent}</pre>
                    <pre>{this.props.published}</pre>
                </div>
            </div>
        )
    }
}

export default withRouter(DetailYours);