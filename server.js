const express = require('express');
const http = require('http');
const socketIO = require('socket.io')
const app = express();
const expressHTTPServer = http.createServer(app);
const io = new socketIO.Server(expressHTTPServer);

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})
io.on('connection', (socket) => {
    console.log("Socket connected!");
})


expressHTTPServer.listen(3000, () => {
    console.log("Server is running on port @3000");
})