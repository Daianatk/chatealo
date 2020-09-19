const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Estableciendo carpeta estatica
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chatealo Bot';

//Se ejecuta cuando el cliente se conecta
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);
    

    // Bienvenido para el usuario actual
    socket.emit('message', formatMessage (botName, 'Bienvenido a Chatealo!'));

    // Se ejecuta cuando un usuario se conecta
    socket.broadcast
    .to(user.room)
    .emit(
        'message', 
        formatMessage (botName, `${user.username}, ingreso a chatealo`)
        );
    });

    //Escucha el mensaje de chat
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message' , formatMessage (user.username, msg));
    });

    //Se ejecuta cuando el cliente se desconecta
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
        io.to(user.room).emit('message', formatMessage (botName,`${user.username} salió de chatealo`)
        )};

        //Enviando información de usuario y sala
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server runing on port ${PORT}`));