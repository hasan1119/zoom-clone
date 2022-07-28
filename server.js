const express = require('express');
const http = require('http');
const {
    v4: uuid
} = require('uuid');
const socketIO = require('socket.io')
const app = express();
const expressHTTPServer = http.createServer(app);
const io = new socketIO.Server(expressHTTPServer);

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.redirect(`/${uuid()}`)
})


app.get("/:roomId", (req, res) => {
    const roomId = req.params.roomId;
    res.render('index', {
        roomId
    });

})




io.on('connection', (socket) => {

    // joining a new room
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);

        // notify others about the new joining in the room
        socket.to(roomId).emit("newJoining")
    })


    // send the offer 
    socket.on("sendTheOffer", (offer, roomId) => {
        socket.to(roomId).emit("receiveOffer", offer)
    })

    // send the answer 
    socket.on("sendTheAnswer", (answer, roomId) => {
        socket.to(roomId).emit("receiveAnswer", answer)
    })


    // send Ice candidate 
    socket.on("sendIceCandidate", (candidate, roomId) => {
        socket.to(roomId).emit("receiveCandidate", candidate)
    })




    console.log("Socket connected!");
})


expressHTTPServer.listen(3000)