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
    const msg = e.target.elements.msg.value;

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
    div.innerHTML= `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Agregando nombre de la sala en el DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//Agregando usuarios al DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join()}
    `;
}