// message 는 object 이어야 함.
const encodeToWs = (message) => {
    return escape(JSON.stringify(message));
}

const decodeFromWs = (message) => {
    return JSON.parse(unescape(message));
}

module.exports.encodeToWs = encodeToWs;
module.exports.decodeFromWs = decodeFromWs;