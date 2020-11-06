var mysql = require('mysql');
var config = require('../config');
var connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});
connection.connect();
var DB = {
  closeDB() {
    connection.end();
  },
  //单个sql
  sqlDB(sql) {
    var p = new Promise(function (resolve, reject) {
      connection.query(sql, function (error, results, fields) {
        // console.log(results)
        if (results) {
          results = JSON.stringify(results);
          results = JSON.parse(results);
          // console.log(results)
          resolve(results);
        } else {
          resolve(false);
        }
      });
    });
    return p;
  },
  //事务开始
  beginTransaction(sqlList) {
    return connection.beginTransaction(function (err) {
      if (err) { throw err; }
    });
  },
  //  回滚事务
  rollbackTransaction(){
    return connection.rollback(function() {});
  },
  // 提交事务
  commitTransaction(err) {
    return connection.commit(function(err) {
      if (err) {
        return connection.rollback(function() {
          throw err;
        });
      }
      console.log('transaction success!');
    });
  }

}
module.exports = DB;
