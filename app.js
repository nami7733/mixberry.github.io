const express = require('express');
const mysql = require('mysql');

const app = express();

app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'nami7373',
  database: 'first_app'
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});



app.get('/', (req,res) => {
  res.render('top.ejs');
});

app.get('/index', (req, res) => {　　　　　　　　//食料品、一覧画面へ
  connection.query(
    'SELECT * FROM items',
    (error, results) => {
    console.log(results);
    res.render('index.ejs', {gifts: results}); //gifts に　results を代入し、
  }　　　　　　　　　　　　　　　　　　　　　　　　//index.ejsのgifts　に渡す
 );
});

app.get('/index-1', (req, res) => {　　　　　　　//調味料、一覧画面へ
  connection.query(
    'SELECT * FROM tyoumis',
    (error, results) => {
    console.log(results);
    res.render('index-1.ejs', {tyoumis: results}); //tyoumis に　results を代入し、
  }                                           //index-1.ejsのtyoumis　に渡す
  );
});


app.get('/index2', (req, res) => {            //日用品、一覧画面へ
  connection.query(
    'SELECT * FROM dairies',
    (error, results) => {
    console.log(results);
    res.render('index2.ejs', {gifts: results}); //gifts に　results を代入し、
  }                                           //index.ejsのgifts　に渡す
  );
});

app.get('/new', (req, res) => {          //食料品新規作成画面へ
  res.render('new.ejs');
});

app.get('/new-tyoumi', (req, res) => {    //調味料新規作成画面へ
  res.render('new-tyoumi.ejs');
});

app.get('/new2', (req, res) => {　　　　　//日用品新規作成画面へ
  res.render('new2.ejs');
});


app.post('/create', (req, res) => {　　　　　//食料品新規作成画面で追加し、一覧画面を表示
  connection.query(
    'INSERT INTO items(name) VALUE(?)',
    [req.body.giftName],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.post('/create-tyoumi', (req, res) => {    //調味料新規作成画面で追加し、一覧画面へを表示
  connection.query(
    'INSERT INTO tyoumis (name) VALUES(?)',
    [req.body.tyoumiName],
    (error, results) => {
      res.redirect('/index-1');
    }
  );
});

app.post('/create2', (req, res) => {　　　　　//日用品新規作成画面で追加し、一覧画面を表示
  connection.query(
    'INSERT INTO dairies(name) VALUE(?)',
    [req.body.giftName],
    (error, results) => {
      res.redirect('/index2');
    }
  );
});


app.post('/delete/:id', (req, res) => {　　　　　//食料品、買い物リストから削除
  connection.query(
  'DELETE FROM items WHERE id=?',
    [req.params.id],
  (error, results) => {
    res.redirect('/index');
  }
 );
});

app.post('/delete-tyoumi/:id', (req, res) => {    //調味料、買い物リストから削除
  connection.query(
  'DELETE FROM tyoumis WHERE id= ?',
  [req.params.id],
  (error, results) => {
    res.redirect('/index-1');
  }
 );
});

app.post('/delete2/:id', (req, res) => {　　　　//日用品、買い物リストから削除
  connection.query(
  'DELETE FROM dairies WHERE id=?',
    [req.params.id],
  (error, results) => {
    res.redirect('/index2');
  }
 );
});


app.get('/edit/:id', (req, res) => {      //食料品、編集画面に移る(フォームに既定値を表示する)
  connection.query(
    'SELECT * FROM items WHERE id =?',
    [req.params.id],
    (error, results) => {
      console.log(results);
      res.render('edit.ejs', {gift:results[0]});　　//結果は一つなので、giftは単数形
    }
  );
});

app.get('/edit-tyoumi/:id', (req, res) => {       //調味料、編集画面に移る(フォームに既定値を表示する)
  connection.query(
    'SELECT * FROM tyoumis WHERE id= ?',
    [req.params.id],
    (error, results) => {
      res.render('edit-tyoumi.ejs', {tyoumi: results[0]});
    }
  );
});

app.get('/edit2/:id', (req, res) => {      //日用品、編集画面に移る(フォームに既定値を表示する)
  connection.query(
    'SELECT * FROM dairies WHERE id =?',
    [req.params.id],
    (error, results) => {
      console.log(results);
      res.render('edit2.ejs', {gift:results[0]});　　//結果は一つなので、giftは単数形
    }
  );
});
　　　　　　　　　　　　　　　　　　　　　　
    　　　　　　　　　　　　　　　　　　　　　
app.post('/update/:id', (req, res) => {    //食料品、編集画面で編集する
  connection.query(
  'UPDATE items SET name= ? WHERE id= ?',
  [req.body.giftName, req.params.id],　　　//選択したidのname列の値を、フォームに入力した値に更新する
　(error, results) => {
    res.redirect('/index');
  }
 );
});

app.post('/update-tyoumi/:id', (req, res) => {    //調味料、編集画面で編集する
  connection.query(
    'UPDATE tyoumis SET name=? WHERE id = ?',
    [req.body.tyoumiName, req.params.id],
    (error, results) => {
    res.redirect('/index-1');
  }
 );
});

app.post('/update2/:id', (req, res) => {    //日用品、編集画面で編集する
  connection.query(
  'UPDATE dairies SET name= ? WHERE id= ?',
  [req.body.giftName, req.params.id],　　　//選択したidのname列の値を、フォームに入力した値に更新する
　(error, results) => {
    res.redirect('/index2');
  }
 );
});

// ここより、在庫管理

app.get('/syoku', (req, res) => {          //食料品　　　在庫一覧画面へ
  connection.query(
  'SELECT * FROM syoku_zai',
  (error, results) => {
    res.render('syoku.ejs', {gifts: results});
  }
 );
});

app.get('/tyoumi', (req, res) => {        //調味料、在庫一覧画面へ
  connection.query(
    'SELECT * FROM tyoumi_zai',
    (error, results) => {
      res.render('tyoumi.ejs', {tyoumis: results});
    }
  );
});



app.get('/niti', (req, res) => {　　　　　　//日用品、在庫一覧画面へ
  connection.query(
    'SELECT * FROM niti_zai',
    (error, results) => {
      res.render('niti.ejs', {gifts: results});
    }
  );
});


app.get('/new3', (req, res) => {　　　　　　//食料品在庫、新規作成画面へ
  res.render('new3.ejs');
});

app.get('/new-tyoumi-zai', (req, res) => {    //調味料在庫、新規作成画面へ
  res.render('new-tyoumi-zai.ejs');
});

app.get('/new4', (req, res) => {　　　　　　//日用品在庫、新規作成画面へ
  res.render('new4.ejs');
});


app.post('/create3', (req, res) => {　　　　　　//食料品在庫、新規作成画面にて作成、在庫一覧表表示
  connection.query(
    'INSERT INTO syoku_zai (name, kosuu) VALUES(?, ?)',
    [req.body.giftName, req.body.giftKosuu],
    (error, results) => {
      res.redirect('/syoku');
    }
  );
});

app.post('/create-tyoumi-zai', (req, res) => {      //調味料在庫、新規作成画面にて作成、在庫一覧表表示
  connection.query(
    'INSERT INTO tyoumi_zai (name, kosuu) VALUES(?, ?)',
    [req.body.tyoumiName, req.body.tyoumiKosuu],
    (error, results) => {
      res.redirect('/tyoumi');
    }
  );
});

app.post('/create4', (req, res) => {　　　　　　//日用品在庫、新規作成画面にて作成、在庫一覧表表示
  connection.query(
    'INSERT INTO niti_zai (name, kosuu) VALUES(?, ?)',
    [req.body.giftName, req.body.giftKosuu],
    (error, results) => {
      res.redirect('/niti');
    }
  );
});



app.post('/delete3/:id',(req, res) => {　　　　//食料品在庫一覧表より削除
  connection.query(
    'DELETE FROM syoku_zai WHERE id = ?',
    [req.params.id],
    (error, results) => {
        res.redirect('/syoku');
    }
   );
 });

 app.post('/delete-tyoumi-zai/:id', (req, res) => {       //調味料在庫一覧表より削除
   connection.query(
     'DELETE FROM tyoumi_zai WHERE id= ?',
     [req.params.id],
     (error, results) => {
       res.redirect('/tyoumi');
     }
   );
 });

app.post('/delete4/:id', (req, res) => {　　　　　　　　　//日用品在庫一覧表より削除

  connection.query(
    'DELETE FROM niti_zai WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/niti');
    }
  );
});



app.get('/edit3/:id', (req, res) => {      //編集画面を表示する(食料品在庫)
  connection.query(
    'SELECT * FROM syoku_zai WHERE id = ?',
    [req.params.id],
    (error, results) => {
      console.log(results);
      res.render('edit3.ejs', {gift: results[0]});
    }
  );
});

app.post('/update3/:id', (req, res) => {    //編集画面で値を更新する
  connection.query(
    'UPDATE syoku_zai SET name = ?, kosuu= ? WHERE id = ?',
    [req.body.giftName, req.body.giftKosuu, req.params.id],
    (error, results) => {
      res.redirect('/syoku');
    }
  );
});



app.get('/edit4/:id', (req, res) => {　　　　　　　//日用品在庫、編集画面を表示する
  connection.query(
    'SELECT * FROM niti_zai WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.render('edit4.ejs',{gift: results[0]});
    }
  );
});

app.post('/update4/:id', (req, res) => {　　　　　　//編集画面で値を更新する
  connection.query(
    'UPDATE niti_zai SET name= ?, kosuu =? WHERE id =?',
    [req.body.giftName, req.body.giftKosuu, req.params.id],
    (error, results) => {
      res.redirect('/niti');
    }
  );
});


app.get('/edit-tyoumi-zai/:id', (req, res) => {    //調味料在庫、編集画面を表示
  connection.query(
    'SELECT * FROM tyoumi_zai WHERE id= ?',
    [req.params.id],
    (error, results) => {
      console.log(results);
      res.render('edit-tyoumi-zai.ejs', {tyoumi: results[0]});
    }
  );
});

app.post('/update-tyoumi-zai/:id', (req, res) => {     //編集画面で値を更新する
  connection.query(
    'UPDATE tyoumi_zai SET name = ?, kosuu = ?  WHERE id = ?',
    [req.body.tyoumiName, req.body.tyoumiKosuu, req.params.id],
    (error, results) => {
      res.redirect('/tyoumi');
    }
  );
});


app.get('/add/:id', (req, res) => {　　　　//食料品、「在庫へ追加画面」へ推移
  connection.query(
    'SELECT * FROM items WHERE id= ?',
    [req.params.id],
    (error, results) => {
      res.render('add.ejs', {gift:results[0]});
    }
  );
});

app.post('/addedit/:id', (req, res) => {    //食料品、「在庫へ追加画面」で追加編集
 connection.query(
  'INSERT INTO syoku_zai(name) VALUES(?)',
  [req.body.giftName],
(error, results) => {
  res.redirect('/syoku');
  }
 );
});

app.get('/add2/:id', (req, res) => {　　　　　//日用品、「在庫へ追加画面」へ推移
  connection.query(
    'SELECT * FROM dairies WHERE id= ?',
    [req.params.id],
    (error, results) => {
      res.render('add2.ejs', {gift: results[0]});
    }
  );
});

app.post('/addedit2/:id', (req, res) => {　　//日用品、「在庫へ追加画面」で追加編集
  connection.query(
    'INSERT INTO niti_zai (name) VALUES(?)',
    [req.body.giftName],
    (error, results) => {
      res.redirect('/niti');
    }
  );
});

app.get('/add3/:id', (req, res) => {         //調味料、「在庫へ追加画面」へ推移
  connection.query(
    'SELECT * FROM tyoumis where id = ?',
    [req.params.id],
    (error, results) => {
      res.render('add3.ejs', {tyoumi: results[0]});
    }
  );
});

app.post('/addedit3/:id', (req, res) => {      //調味料、「在庫へ追加画面」で追加編集
  connection.query(
    'INSERT INTO tyoumi_zai (name) VALUES(?)',
    [req.body.tyoumiName],
    (error, results) => {
      res.redirect('/tyoumi');
    }
  );
});

app.get('/sort', (req, res) => {              //日用品在庫一覧を昇順で並べ替える
  connection.query(
    'SELECT * FROM niti_zai ORDER BY name',
    (error, results) => {
      res.render('niti.ejs', {gifts: results});
    }
  );
});





app.listen(3000);
