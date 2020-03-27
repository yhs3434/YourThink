function datetimeToJs(datetime) {
    // Split timestamp into [ Y, M, D, h, m, s ]
    var t = datetime.split(/[- :]/);

    // Apply each element to the Date function
    var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));

    return d;
}

function datetimeToMysql(datetime) {
    return new Date(datetime).toISOString().slice(0, 19).replace('T', ' ');
}

exports.datetimeToJs = datetimeToJs;
exports.datetimeToMysql = datetimeToMysql;