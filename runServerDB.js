var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require('socket.io')(server);
var fs = require("fs");
var mysql = require('mysql');
server.listen(process.env.PORT || 3000);

var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'student_mana'
});

// app.get("/", function(req, res){
// 	res.sendFile(__dirname + "/index.html");	
// });
console.log("Server running");
var arrayUser = [];
var registerResult;

//sự kiện nhận dữ liệu đc gửi lên từ client
io.sockets.on('connection',function(socket){
	console.log("Have device connect");
	// nhận dữ liệu
	// first input: tên sự kiện, client(app) gửi tên sự kiện nào thì server phải nhận đúng tên đó
	// second input: nhận giá trị đc gửi lên từ client, nhận trg function
	socket.on('client-register-user',function(data){
		// Biến data: là dữ liệu sẽ nhận đc từ client(app)
		console.log("Server recvied: "+data);
		if(arrayUser.indexOf(data)==-1){
			//user chưa đc đk
			arrayUser.push(data);
			console.log(data+" added susccessfully");
			registerResult = data+" added susccessfully";
			//gán tên user cho socket để server biết là nhận dữ liệu từ user nào
			socket.un = data;
			//gửi danh sách user về all máy đang kết nối tới server
			io.sockets.emit('server-send-allUserRegister',{userList:arrayUser});
		}else{
			// đã tồn tại user thì ko cho đk
			console.log(data+" existed");
			 registerResult = data+" existed";
		}
		// gửi phản hồi/dữ liệu về client(app)
		/*
        first input: tên sự kiện gửi
        second input: dữ liệu gửi(dạng json và json object)
         */
		// io.sockets.emit('server-send-data',{noidung:data});//-> code này là gửi về tất cả các thiết bị đang kết nối tới server
		// code dưới là gửi kết quả về cho cái máy vừa gửi dữ liệu lên server
		socket.emit('server-send-registerResult',{result:registerResult});
	});

	socket.on('client-get-studentList',function(){
		//get All Student
		app.get("/student",(req,res,next)=>{
    	connect.query('SELECT * FROM student',function(error,result,fields){
        connect.on('error',function(err){
            console.log('[MYSQL]ERROR',err);
        });
        if(result && result.length){
            // res.end(JSON.stringify(result));
           	console.log(result);
            socket.emit('server-send-studentList',{studentList:res.end(JSON.stringify(result))});
        }else{
            // res.end(JSON.stringify('NO STUDENT HERE'));
             socket.emit('server-send-studentList',{studentList:'NO STUDENT HERE'});
        }
    });
		});

	});

	socket.on('client-send-chat-message',function(chatMessageReceviedFromClient){
		console.log(socket.un+": "+chatMessageReceviedFromClient);
		var respone = socket.un+": "+chatMessageReceviedFromClient;
		io.sockets.emit('server-response-chat-message',{responseContent:respone});
	});
});