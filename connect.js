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
app.get('/welcomeScript.js', function(req, res,next) {  
    res.sendFile(__dirname + '/welcomeScript.js');
});
app.get('/welcome.html', function(req, res,next) {  
    res.sendFile(__dirname + '/welcome.html');
});
app.get('/index.html', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

const clients = {};
const games = {};
const uid = new ShortUniqueId();


io.on('connection', request => {
    request.on('message', message => {
        if (message.method === "create"){
            const clientId = message.clientId;
            const gameId = uid.randomUUID(4).toUpperCase();
            games[gameId] = {
                "id": gameId,
                "clients": [] 
            }
            const payLoad = {
                "method": "create",
                "game" : games[gameId]
            }
            request.emit('message', payLoad);
        }

        if (message.method === "join") {
            const clientId = message.clientId;
            const gameId = message.gameId;
            const game = games[gameId];
            if (game.clients.length > 12) {
                return;
            }
            // // how to choose if client is hider or seeker
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
            const payLoad = {
                "method": "join",
                "game": game
            }
            io.emit('message', payLoad);
        }
    })
    const clientId = uid.randomUUID(8);
    const payLoad = {
        "method": "connect",
        "clientId": clientId
    }
    //send back the client connect
    io.emit('message', payLoad);
})    
server.listen(80)