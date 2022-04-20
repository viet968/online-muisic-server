var express = require("express");
var app = express();
var database = require("./connectDB");
var server = require("http").createServer(app);
var io = require('socket.io')(server);
var fs = require("fs");
server.listen(process.env.PORT || 3000);

// app.get("/", function(req, res){
// 	res.sendFile(__dirname + "/index.html");	
// });
console.log("Server running");

app.get("/listStudent",function(req,res){
    database.getAllStudent(function(resultQuery){
        res.json(resultQuery);
    });
});


