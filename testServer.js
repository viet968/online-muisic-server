const bodyParser = require("body-parser");
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require('socket.io')(server);
var fs = require("fs");
var mysql = require('mysql');


var con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'student_mana'
});
 
con.connect(function(err){
   if(err) throw err;
   console.log("Connected!!....");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/studentList',(req,res)=>{
    let sql = "select * from student";
    let query = con.query(sql,(err,result)=>{
        if(err) throw err;
        res.send(JSON.stringify({"status":200, "error":null,"response":result}))
    });
});

app.post('/addStudent',function(req,res,next){
    // var fullname = req.body.FULLNAME;
    // var age = req.body.AGE;
    // var birthyear = req.body.BIRTHYEAR;
    
    var sql = "insert into student values(null,'" + req.body.fullname + "','" + req.body.age + "','" + req.body.birthyear + "')";
    con.query(sql,function(err,result){
        if(err) throw err;

        res.json({'status':'success',id:result.insertId})
    });
});

app.post("/search",(req,res,next)=>{
    var post_data = req.body;
    var id_search = post_data.search;
    var query = "SELECT * FROM student WHERE ID = "+id_search;
    connect.query(query,function(error,result,fields){
        connect.on('error',function(err){
            console.log('[MYSQL]ERROR',err);
        });
        if(result && result.length){
            res.end(JSON.stringify(result));
        }else{
            res.end(JSON.stringify('NO STUDENT HERE'));
        }
    });
});


server.listen(process.env.PORT || 3000);