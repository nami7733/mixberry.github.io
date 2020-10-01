const express = require('express');
path = require('path');
//const mysql = require('mysql');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;

//const connection = mysql.createConnection({
//  host: 'localhost',
//  user: 'root',
//  password: 'nami7373',
//  database: 'list_app'
//});


//connection.connect((err) => {
//  if (err) {
//    console.log('error connecting: ' + err.stack);
//    return;
//  }
//  console.log('success');
//});

app.get('/', (req, res) => {
  //connection.query(
  //  'SELECT * FROM users',
  //  (error, results) => {
  //    console.log(results);
      res.render('hello.ejs');
  //  }
  //);
});

app.listen(3000);
