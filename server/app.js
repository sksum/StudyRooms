const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server);

const db = {
    rooms : {},
    socket2Room: {}
}

io.on('connection', socket => {
    console.log(`connected ${socket.id}`)

    socket.on('init', (roomID, desc, avail) => {
        let room = { 
            id: roomID,
            desc: desc,
            avail: avail,
            students: []
        }
        db.rooms[roomID] = room;
        console.log("new room:::",socket.id,JSON.stringify(room))
    }) 

    socket.on("calling peer" , soc => {
        io.to(soc).emit("called",socket.id);
    })

    socket.on("joinRoom", roomID => {
        const room = db.rooms[roomID];
        console.log(JSON.stringify(room))
        
        db.socket2Room[socket.id] = roomID;
        if (room) {
            
            const length = room.students.length;
            if (length >= 4) {
                socket.emit("room full");
                return;
            }
            db.rooms[roomID].students.push(socket.id);
            const usersInThisRoom = room.students.filter(id => id !== socket.id);
            socket.emit("listOfPeers", usersInThisRoom);
            console.log(`room ${roomID} : ${room.desc} entered by ${socket.id}`  )
        } 
        else {
            console.log("room not found")
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