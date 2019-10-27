const mysql = require("mysql");
const globalConf = require("../config");

function createConnection() {
    let connection = mysql.createConnection({
        user: globalConf.db_user,
        password: globalConf.db_password,
        database: globalConf.db_database,
        port: globalConf.db_port,
        host: globalConf.db_host
    })
    return connection;
}

module.exports.createConnection = createConnection;