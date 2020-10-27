const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socketIo = require("socket.io");
const io =  socketIo(server);

const invils = {};
const db = {
    rooms: {}
};



io.sockets.on("connection", socket => {
    console.log(`connected: ${socket.id} `)
    
    socket.on("init",(room) => {
        let id = room.id
        console.log(`making new room :${id} `)
        db.rooms[id] = JSON.parse(JSON.stringify(room));
        console.log(`new room: ${JSON.stringify(room)}`);
    })

    socket.on("enter",(ROOM_ID) => {
        console.log(` user: ${socket.id} enters room: ${ROOM_ID}`) 
    })

    socket.on("offer", payload => {
        console.log(`offered :${payload.target} :: ${socket.id}`)
        io.to(payload.target).emit("offer_received",payload)
    })
    
    socket.on("answer", payload => {
        console.log(`answered :${payload.target} :: ${socket.id}`)
        io.to(payload.target).emit("answer_received",payload)
    })

    socket.on("ice-candidate", incoming => {
        console.log(`iced :${incoming.target} :: ${socket.id}`)
        io.to(incoming.target).emit("ice-candidate_received",incoming.candidate)
    })
});

server.listen(8000 ,() => {console.log("server2 running")});
