const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Estableciendo carpeta estatica
app.use(express.static(path.join(__dirname, 'public')));

//Se ejecuta cuando el cliente se conecta
io.on('connection', socket => {
    console.log('New WS Connection...');

    socket.emit('message', 'Bienvenido a Chatealo!');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server runing on port ${PORT}`));