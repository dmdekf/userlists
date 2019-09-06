const express = require('express');
var bodyParser = require('body-parser')
require('dotenv').config();
const app = express()
const mysql = require('mysql');
const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
})

db.connect()


app.set('views', __dirname+'/views')
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile)
app.use(bodyParser.urlencoded({extended:false}))

app.get('/topic/add', (rep, res)=>{
    var sql = 'SELECT * FROM topic'
    db.query(sql , (err, result)=>{
        if(err){
            console.log(err);
            res.status(500).send("Internel Sever Error.")
        }
        console.log(result)
        res.render('add',{topics :result})
        // res.send(result) data를 보낼 수 있는 명령.
    })
})

app.post('/topic/add', (req, res)=>{
    console.log(req.body);
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?);'
    var params = [title, description, author];
    db.query(sql, params, (err, result)=>{
        if(err){
            console.log(err)
            res.status(500).send("Internel Sever Error.")
        }
        console.log('Success.')
        res.redirect(`/topic/${result.insertId}`)
    })

})
// const router = require('./routes')(app)
const urlPort = process.env.PORT || 5000;
app.listen(urlPort, ()=>{
    console.log(`server is starting : http://locallhost:${urlPort}`)
})
