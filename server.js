const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Estableciendo carpeta estatica
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chatealo Bot';

//Se ejecuta cuando el cliente se conecta
io.on('connection', socket => {

    // Bienvenido para el usuario actual
    socket.emit('message', formatMessage (botName, 'Bienvenido a Chatealo!'));

    // Se ejecuta cuando un usuario se conecta
    socket.broadcast.emit('message', formatMessage (botName,'A user has joined the chat'));

    //Se ejecuta cuando el cliente se desconecta
    socket.on('disconnect', () => {
        io.emit('message', formatMessage (botName,'A user has left the chat'));
    });

    //Escucha el mensaje de chat
    socket.on('chatMessage', msg => {
        io.emit('message' , formatMessage ('USER', msg));
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server runing on port ${PORT}`));