var express = require('express'); 
var topgames = express.Router(); 
var request = require('request'); 
var fs = require('fs'); 

topgames.get('/',function(req,res){
    request('https://api.twitch.tv/kraken/games/top?client_id=qyxrk320s0583sbi4tcnhcsq01n82jm',function(error,response,body){
        if(!error && response.statusCode==200){
            var topgames = JSON.parse(body);
            res.json(topgames);
            console.log(topgames.top[0].game.name);            
        }else if(response.statusCode==503){
            res.send('503 Service Unavailable');
        }else{
            res.send('Cannot connect to Twitch Server API'); 
        }
    });
})
module.exports = topgames; 


