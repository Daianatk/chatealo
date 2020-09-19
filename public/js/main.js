const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Obtener nombre de usuario y sala desde el URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//Unirse a la sala de chatealo
socket.emit('joinRoom' , { username, room });

//Obteniendo sala y usuario
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

//Mensaje del servidor
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //Desplazarse hacia abajo Automaticamente
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Enviar mensaje
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener el texto del mensaje
    let msg = e.target.elements.msg.value;
  
    msg = msg.trim();
    
    if (!msg){
      return false;
    }

    //Emite mensaje al servidor
    socket.emit('chatMessage' , msg);

    //Limpiar input
    e.target.elements.msg.value= '';
    e.target.elements.msg.focus();
});

//Mensaje de Salida hacia el DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
  }

//Agregando nombre de la sala en el DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//Agregando usuarios al DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach(user=>{
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
   }