const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    database: 'saboroso',
    password: 'Bieldias@882'
});

module.exports = connection