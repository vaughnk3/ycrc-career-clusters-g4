const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'deltona.birdnest.org',
  user: 'my.vaughnk3',
  password: '09cc!369y',
  database: 'my_vaughnk3_career_cluster',
});

module.exports = connection;

