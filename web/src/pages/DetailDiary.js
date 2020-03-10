import React, {Component} from 'react';
import {openDB} from '../lib/indexeddb';

class DetailDiary extends Component {
    state = {
        memoTitle: undefined,
        memoContent: undefined,
        published: undefined,

        db: undefined,
        DB_NAME: undefined,
        DB_VERSION: undefined,
        DB_STORE_NAME: undefined
    }

    async componentDidMount() {
        const id = Number(this.props.match.params.id);
        
        const ret = await openDB();
        this.setState({
            db: ret,
            DB_NAME: ret.name,
            DB_VERSION: ret.version,
            DB_STORE_NAME: ret.objectStoreNames[0]
        });

        let objectStore = this.getObjectStore(this.state.DB_STORE_NAME, 'readonly');
        let request = objectStore.get(id);
        request.onerror = (event) => {
            console.log('가져오기 실패');
        }
        request.onsuccess = (event) => {
            console.log('가져오기 성공');
            //console.log(request.result);
            this.setState({
                memoTitle: request.result.memoTitle,
                memoContent: request.result.memoContent,
                published: request.result.published
            });
        }
    }

    getObjectStore = (store_name, mode) => {
        if (Boolean(this.state.db)) {
            let db = this.state.db;
            return db.transaction(store_name, mode).objectStore(store_name);
        }
    }

    render() {
        const style = {
            wrap: {
                display: 'flex',
                flexDirection: 'column',
                width: '80%',
                alignItems: 'center'
            },
            titleWrap: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center'
            },
            contentWrap: {
                whiteSpace: 'pre-wrap'
            },
            title: {
                alignSelf: 'center',
                fontSize: 20
            }
        }
        return (
            <div style={style.wrap}>
                <pre><span style={style.title}>{this.state.memoTitle}</span></pre>
                <pre style={style.contentWrap}>{this.state.memoContent}</pre>
                <pre>{this.state.published}</pre>
            </div>
        )
    }
}

export default DetailDiary;