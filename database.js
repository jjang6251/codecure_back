const mysql = require('mysql');
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '!assaassa0319',
    database : 'login'
});

connection.connect('SELECT id from login', );

co