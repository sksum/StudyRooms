const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const db = {
    rooms : {},
    socket2Room: {}
}

io.on('connection', socket => {
    console.log(`connected ${socket.id}`)
    socket.on("init", (roomID,desc,avail) => {
        let room = { 
            id: roomID,
            desc: desc,
            avail: avail,
            students: [socket.id]
        }
        db.rooms[roomID] = room;
        db.socket2Room[socket.id] = roomID;
        console.log("new room:::",JSON.stringify(room))
    })

    socket.on("joinRoom", roomID => {
        const room = db.rooms[roomID];
        console.log(JSON.stringify(room))
        console.log(`room ${roomID} : ${room.desc},${room.students.length} entered by ${socket.id}`  )
        if (room && room.students.length) {
            const length = room.students.length;
            if (length >= 4) {
                socket.emit("room full");
                return;
            }
            console.log('hello')
            db.rooms[roomID].students.push(socket.id);
            db.socket2Room[socket.id] = roomID;
            const usersInThisRoom = room.students.filter(id => id !== socket.id);
            console.log("listOfPeers ", usersInThisRoom)
            socket.emit("listOfPeers", usersInThisRoom);
        }

    });


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

    socket.on('disconnect', () => {
        const roomID = db.socket2Room[socket.id];
        let room = db.rooms[roomID];
        if (room) {
            let std = room.students.filter(id => id !== socket.id);
            db.rooms[roomID].students = std;
        }
    });

});

server.listen(process.env.PORT || 8000, () => console.log('server is running on port 8000'));