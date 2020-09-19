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

// Se ejecuta cuando un cliente se conecta
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
      const user = userJoin(socket.id, username, room);
  
      socket.join(user.room);
  
      // Bienvenida al usuario
      socket.emit('message', formatMessage(botName, 'Bienvenido a Chatealo!'));
  
      // Se ejecuta cuando un usuario entra a la sala
      socket.broadcast
        .to(user.room)
        .emit(
          'message',
          formatMessage(botName, `${user.username} a ingresado a Chatealo`)
        );
  
      // Muestra el usuaio y la información de la sala
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });
  
    // Escuchando los mensajes de chatealo
    socket.on('chatMessage', msg => {
      const user = getCurrentUser(socket.id);
  
      io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
  
    // Se muestra cuando el usuario se desconecta
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
  
      if (user) {
        io.to(user.room).emit(
          'message',
          formatMessage(botName, `${user.username} a dejalo la sala del chat`)
        );
  
        // Muestra el usuario y la informacion de la sala
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  });

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`El servidor esta corriendo en el puerto ${PORT}`));