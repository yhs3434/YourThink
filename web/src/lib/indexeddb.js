import {memoConfig} from './dbconfig';

export function openDB() {
    return new Promise(function(resolve, reject) {
        let req = indexedDB.open(memoConfig.DB_NAME, memoConfig.DB_VERSION);
        req.onsuccess = (evt) => {
            let db = evt.target.result;
            resolve(db);
        };
        req.onerror = (evt) => {
            console.error("indexedDB : ", evt.target.errorCode);
            reject();
        };
        req.onupgradeneeded = (evt) => {
            let store = evt.currentTarget.result.createObjectStore(memoConfig.DB_STORE_NAME,
                {keyPath: 'id', autoIncrement: true});
            store.createIndex('memoTitle', 'memoTitle', {unique: false});
            store.createIndex('memoContent', 'memoContent', {unique: false});
            store.createIndex('published', 'published', {unique: false});
        }
    })
};

export function getObjectStore(db, mode) {
    return db.transaction(memoConfig.DB_STORE_NAME, mode).objectStore(memoConfig.DB_STORE_NAME);
}