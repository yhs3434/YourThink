function datetimeToMysql(datetime) {
    return new Date(datetime).toISOString().slice(0, 19).replace('T', ' ');
}

exports.datetimeToMysql = datetimeToMysql;