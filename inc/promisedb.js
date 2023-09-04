const db2 = require('mysql2-promise')();

db2.configure({
    'host': 'localhost',
    'user': 'root',
    'password': 'Bieldias@882',
    'database': 'saboroso'
})

module.exports = db2