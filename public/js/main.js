const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

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