var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require('socket.io')(server);
var fs = require("fs");
var mysql = require('mysql');
var bodyParser = require('body-parser');
const { callbackify } = require("util");
server.listen(process.env.PORT || 3000);

// connect to mySql
var connect = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'student_mana'
});

console.log("Server running");
// var connect = function(){
//     connection.connect(function(err){
//         if(!err){
//             console.log("Database is connected");
//         }else{
//             console.log("Database connect falid");
//         }
//     });
// }

// var close = function(){
//     connection.end(function(err){
//         if(!err){
//             console.log("Database closed");
//         }
//     });
// }

// // get All Student
// exports.getAllStudent = function(callbackQuery){//exports: same list
//     connect();
//     connection.query("SELECT * FROM student",function(err,results,fields){
//         if(!err){
//             callbackQuery(results);//callbackQuery:same return
//         }else{
//             console.log(err);
//         }
//     });
// }

var publicDir = (__dirname+'/public/');
app.use(express.static(publicDir));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
var arr = [];
var addResult,updateStResult;
var removeStudentResult;


io.sockets.on('connection',function(socket){
    console.log("Have device connect");
    // get All Student
    socket.on('client-get-student',function(){
        console.log('client request get all student');
        // app.get("/student",(req,res,next) =>{
            console.log("/student");
            connect.query('SELECT st.ID,st.FULLNAME,st.AGE,st.BIRTHYEAR,s.AVG FROM student as st left join score as s ON st.ID = s.ID_STUDENT',function(error,result,fields){
                connect.on('error',function(err){
                    console.log('[MYSQL]ERROR',err);
        
                });
                if(result && result.length){
                    // res.end(JSON.stringify(result));
                    
                    // for(var i = result.length;i--; arr.unshift(result[i]));
                    // console.log(result);
                    io.sockets.emit('server-send-get-student',{studentList:result});
                    // socket.emit('server-send-get-student',{studentList:result});
                   
                }
                // else{
                //     // res.end(JSON.stringify('NO STUDENT HERE'));
                //     socket.emit('server-send-get-student',JSON.stringify('NO STUDENT HERE'));
                // }
            });
        // });
    });

    // add Student
    socket.on('client-add-student',function(fullname,age,birthyear){
        console.log("full name: "+fullname);
        console.log("age: "+age);
        console.log("birth year: "+birthyear);
        var sql = "insert into student values(null,'" + fullname + "','" + age + "','" + birthyear + "')";
            connect.query(sql,function(error){
                connect.on('error',function(err){
                    console.log('[MYSQL]ERROR',err);
        
                });
                if(error) addResult = "ADD STUDENT ERROR!!!!!";

                addResult = "ADD STUDENT SUCCESSFULLY";
                
                socket.emit('server-send-add-result',{addResult:addResult});
            });
    });

    // delete Student
    socket.on('client-delete-student',function(getId){
        console.log('get id student needed delete from client: '+getId);
        var sql = "DELETE FROM student WHERE ID = "+getId;
        connect.query(sql,function(error){
            connect.on('error',function(err){
                console.log('[MYSQL]ERROR',err);
    
            });
            if(error) removeStudentResult = "REMOVE STUDENT ERROR!!!"+err.message;
            removeStudentResult = "REMOVE STUDENT SUCCESSFULLY";
            socket.emit('server-send-remove-student-result',{removeStudentResult:removeStudentResult});
            // callback();
        });
        connect.query('SELECT st.ID,st.FULLNAME,st.AGE,st.BIRTHYEAR,s.AVG FROM student as st left join score as s ON st.ID = s.ID_STUDENT',function(error,result,fields){
            connect.on('error',function(err){
                console.log('[MYSQL]ERROR',err);
    
            });
            if(result && result.length){
                io.sockets.emit('server-send-update-student-list',{studentList:result});
            }
        });
        
    });

    // get the score of the student
    socket.on('client-get-score-student',function(getId){
        console.log('get id student needed get score: '+getId);
        var sql = "select AVG from score where ID_STUDENT = "+getId;
        connect.query(sql,function(error,result,fields){
            connect.on('error',function(err){
                console.log('[MYSQL]ERROR',err);
    
            });
            if(error) throw error;
            else{
                if(result && result.length){
                    console.log("get score: "+getId+" -> score is: "+result.toString());
                    socket.emit('server-send-score-student',{getAvgScore:result});
                }
            }
            
        });
    });

    //update the score of the student
    socket.on('client-update-score-student',function(getId,newAvg){
        console.log('get id student needed update: '+getId);
        var sql = "UPDATE score SET AVG = ' " + newAvg + " ' WHERE ID_STUDENT = ' " + getId + " '";
        connect.query(sql,function(error){
            connect.on('error',function(err){
                console.log('[MYSQL]ERROR',err);
    
            });
            if(error) updateStResult = "UPDATE SCORE ERROR!!!!";
                    updateStResult = "UPDATE SCORE SUCCESSFULLY <3";
                
                socket.emit('server-send-update-score-result',{updateStResult:updateStResult});
        });
    });
    
});

// get all Student from db
// app.get("/student",(req,res,next) =>{
//     connect.query('SELECT * FROM student',function(error,result,fields){
//         connect.on('error',function(err){
//             console.log('[MYSQL]ERROR',err);

//         });
//         if(result && result.length){
//             res.end(JSON.stringify(result));
//         }else{
//             res.end(JSON.stringify('NO STUDENT HERE'));
//         }
//     });
// });

//search student by name
app.post("/search",(req,res,next)=>{
    var post_data = req.body;// get post body
    var name_search = post_data.searchName;//get field 'searchName' from post data
    var query = "SELECT * FROM student WHERE FULLNAME LIKE '%"+name_search+"%'";
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

// add student
// app.post("/addstudent",(req,res,next)=>{
//     var sql = "insert into student values(null,'" + req.body.fullname + "','" + req.body.age + "','" + req.body.birthyear + "')";
//     connect.query(sql,function(err){
//         if(err) res.json('Add student ERROR!!!');;

//         res.json('Add student successfully');
//     });
// });


