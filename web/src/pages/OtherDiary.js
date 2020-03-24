import React, {Component} from 'react';
import './css/OtherDiary.css';

class OtherDiary extends Component {
    state = {
        memoTitle: '',
        memoContent: '',
        published: ''
    }

    getDiary = () => {
        const ws = new WebSocket(process.env.REACT_APP_SERVER_SOCKET_URL);
        const obj = {
            type: 'publicGet',
            payload: {

            }
        };
        ws.onopen = (event) => {
            ws.send(escape(JSON.stringify(obj)));
            ws.onmessage = (event) => {
                if (event.data === "close") {
                    ws.close();
                } else {
                    const data = JSON.parse(unescape(event.data));
                    const {memoTitle, memoContent, published} = data;
                    this.setState({
                        memoTitle, memoContent, published
                    });
                }
            }
        }
    }
    render() {
        return(
            <div className="otherDiaryWrap">
                <div>
                    <h3>제목</h3>
                    <pre>{this.state.memoTitle}</pre>
                    <h3>내용</h3>
                    <pre>{this.state.memoContent}</pre>
                    <h3>날짜</h3>
                    <pre>{this.state.published}</pre>
                </div>
                <button onClick={this.getDiary}>가져오기</button>
            </div>
        )
    }
}

export default OtherDiary;