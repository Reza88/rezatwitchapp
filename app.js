var express = require('express'); 
var app = express(); 
var fs = require('fs');
var topgames = require('./routes/topgames.js');

const port = process.env.PORT || 8080; 

app.use('/images',express.static(__dirname+'/images'));

app.use('/topgames',topgames); 

app.use('/default.css',function(req,res){
    res.sendFile(__dirname +'/default.css');
});

app.use('/twitch.js',function(req,res){
    res.sendFile(__dirname+'/twitch.js'); 
});


app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html'); 
});

app.listen(port,function(){
    console.log('Listening on port;' + port);
}); 