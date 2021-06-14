// client handlers, etc.
const server = io('http://localhost')
let clientId = null;
let gameId = null;
let playerRole = null;

const btnCreate = document.getElementById("btnCreate");
const btnJoin = document.getElementById("btnJoin");
const txtGameId = document.getElementById("txtGameId");
const divPlayers = document.getElementById("divPlayers");
const divBoard = document.getElementById("divBoard");


btnJoin.addEventListener("click", e => {
    if (gameId === null)
        gameId = txtGameId.value;
    const payLoad = {
        "method": "join",
        "clientId": clientId,
        "gameId": gameId
    }
    server.emit('message', payLoad)
})

btnCreate.addEventListener("click", e => {
    const payLoad = {
        "method": "create",
        "clientId": clientId
    }
    server.emit('message', payLoad)
})

server.on('message', message => {
    //message.data
    const response = message;
    //connect
    if (response.method === "connect"){
        clientId = response.clientId;
        console.log("Client id Set successfully " + clientId)
    }

    //create
    if (response.method === "create"){
        gameId = response.game.id;
        console.log("game successfully created with id " + response.game.id)  
    }


    //update
    if (response.method === "update"){
        //{1: "red", 1}
        if (!response.game.state) return;
    }

    //join
    if (response.method === "join"){
        const game = response.game;

        while(divPlayers.firstChild)
            divPlayers.removeChild (divPlayers.firstChild)

        game.clients.forEach (c => {

            const d = document.createElement("div");
            // d.style.width = "200px";
            // d.style.background = c.color
            d.textContent = c.clientId;
            divPlayers.appendChild(d);

            //if (c.clientId === clientId) playerColor = c.color;
        })
    }
})