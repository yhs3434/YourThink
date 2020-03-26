// message 는 object 이어야 함.
function encodeToJs(message) {
    return escape(JSON.stringify(message));
}

function decodeFromJs(message) {
    return JSON.parse(unescape(message));
}

module.exports.encodeToJs = encodeToJs;
module.exports.decodeFromJs = decodeFromJs;