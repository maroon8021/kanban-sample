const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = 7000;
const api = require('./api.json');
const axios = require('axios');

io.on('connection',function(socket){
    socket.on('message',function(msg){
        console.log('message: ' + msg);
        io.emit('message', msg);
    });
    socket.on('initialize',function(){
      console.log('Called initialize');
      axios.get(api.kanbanService + '/getalltasks').then((response) => {
        console.log('initialized: ');
        console.log(response.data);
        io.emit('initialized', response.data);
      });
    });
});

http.listen(PORT, function(){
    console.log('server listening. Port:' + PORT);
});