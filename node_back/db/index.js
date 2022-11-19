const mysql = require('mysql')
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '111111',
  database: 'nodetest'
})

module.exports = db