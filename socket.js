const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server,{
    cors:{origin:"*"}
})
var Redis = require('ioredis');
var redis = new Redis();
redis.subscribe('update-training-rqmts-channel', function(err, count) {
    if(err){
        console.error("Failed to subscribe: %s", err.message);
    }else{
        console.log(
            `Subscribed successfully! This client is currently subscribed to ${count} channels.`
          );
    }
});
redis.subscribe('update-training-materials-channel', function(err, count) {
    if(err){
        console.error("Failed to subscribe: %s", err.message);
    }else{
        console.log(
            `Subscribed successfully! This client is currently subscribed to ${count} channels.`
          );
    }
});
redis.on('message', function(channel, message) {
    console.log('Message Recieved: ' + message);
    message = JSON.parse(message);
    // io.emit(channel + ':' + message.event, message.data);
    io.emit(channel, message);
});

io.on('connection',(socket) => {
    console.log('connection');

    socket.on('disconnect', (socket)=>{
        console.log('disconnect');
    })
})
server.listen(3001, () => {
    console.log('Server is running');
})