function convertDatetime(dt) {
    if (dt === 'init') {
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
    } else {
        return new Date(dt).toISOString().slice(0, 19).replace('T', ' ');
    }
    
}

exports.convertDatetime = convertDatetime;