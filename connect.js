var express = require('express');
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var { default: ShortUniqueId } = require('short-unique-id');

app.use(express.static(__dirname + '/node_modules'));  
app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/connect.html');
});
app.get('/connectScript.js', function(req, res,next) {  
    res.sendFile(__dirname + '/connectScript.js');
});
app.get('/welcome.html', function(req, res,next) {  
    res.sendFile(__dirname + '/welcome.html');
});
app.get('/index.html', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

const clients = {};
const games = {};


io.on('connection', request => {
    request.on('createData', data=>{
        // this is a good time to add the HOST to the clientList
        request.emit('host-connection', data);
    })
    request.on('message', message => {
        if (message.method === "create"){
            const clientId = message.clientId;
            const uid = new ShortUniqueId();
            const gameId = uid.randomUUID(4).toUpperCase();
            games[gameId] = {
                "id": gameId,
                "clients": [] 
            }
            const payLoad = {
                "method": "create",
                "game" : games[gameId]
            }
            const con = clients[clientId];
            request.emit('message', payLoad);
        }

        if (message.method === "join") {

            const clientId = request.clientId;
            const gameId = message.gameId;
            const game = games[gameId];
            if (game.clients.length > 12) 
            {
                return;
            }
            // how to choose if client is hider or seeker
            // const role = null;
            // for (int x = 0; x < game.clients.length; x++){
            //     if ((Math.random()*10) % 2 === 0  ){
            //         role  = "Hider";
            //     }
            //     else    
            //         role = "seeker";
            // }
            game.clients.push({
                "clientId": clientId,
                //"role": role
            })
            //if (game.clients.length === 3) updateGameState();

            const payLoad = {
                "method": "join",
                "game": game
            }
            game.clients.forEach(c => {
                request.broadcast.to(clients[c.clientId]).emit('message', payLoad);
            })
        }
    })
    // const clientId = uuidv4();
    // clients[clientId] = {
    //     "connection":  connection
    // }
    // const payLoad = {
    //     "method": "connect",
    //     "clientId": clientId
    // }
    // //send back the client connect
    // request.broadcast.to(connection).emit('message', JSON.stringify(payLoad));
})    
server.listen(80)