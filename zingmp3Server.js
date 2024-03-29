var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require('socket.io')(server);
var fs = require("fs");
const ZingMp3 = require("zingmp3-api-full")
const PORT = process.env.PORT || 3000;
const host = '0.0.0.0';
server.listen(PORT,host);

console.log("You conneting to zing mp3 server");

app.get('/api/find',(req,res)=>{
  ZingMp3.search(req.query.keyword).then((data) => {
    res.status(200).send(JSON.stringify(data));
    console.log(data);
  })
});

app.get('/api/song',(req,res) =>{
    ZingMp3.getSong(req.query.id).then((data) => {
        res.status(200).send(JSON.stringify(data));
        console.log(data);
      });
   
});

app.get('/api/lyrics',(req,res)=>{
  ZingMp3.getLyric(req.query.id).then((data) => {
    res.status(200).send(JSON.stringify(data));
    // console.log(data);
  })
});

app.get('/api/topmv',(req,res)=>{
  ZingMp3.getListMV("IWZ9Z08I", "1", "30").then((data) => {
    // console.log(data)
    res.status(200).send(JSON.stringify(data));
  })
});

app.get('/api/getmv',(req,res)=>{
  ZingMp3.getVideo(req.query.id).then((data) => {
    res.status(200).send(JSON.stringify(data));
  })
});

app.get('/api/categorymv',(req,res)=>{
  ZingMp3.getCategoryMV("IWZ9Z08I").then((data) => {
    res.status(200).send(JSON.stringify(data));
  })
});


