var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require('socket.io')(server);
var fs = require("fs");
const ZingMp3 = require("zingmp3-api-full")

server.listen(process.env.PORT || 3000);

console.log("You conneting to zing mp3 server");

app.get('/api/song',(req,res) =>{
    ZingMp3.getSong(req.query.id).then((data) => {
        res.status(200).send(JSON.stringify(data));
        // console.log(data);
      });
   
});

app.get('/api/lyrics',(req,res)=>{
  ZingMp3.getLyric(req.query.id).then((data) => {
    res.status(200).send(JSON.stringify(data));
    // console.log(data);
  })
});


