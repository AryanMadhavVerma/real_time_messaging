const socket = io('http://localhost:8000')

console.log("Script is invoked")

const form  = document.getElementById('send-container')

const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector('.container'); //the place where we put the message


var audio = new Audio('./resources/message_sound.mp3');
audio.crossOrigin = 'anonymous';

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left') {
        audio.play();
        console.log("audio plauyed")
    } 

}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right')
    socket.emit('send', message);
    messageInput.value = '';
})

const person = prompt("Enter your name to join");
socket.emit('new-user-joined', person) //this gives socket a new-user-joined event its a kind of request to the socket server 

socket.on('user-joined', name => { //socket response is received
    append(`${name} joined the chat`, 'right')
})

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
})

socket.on('left', name => {
    append(`${name} left the chat`, 'left')
    console.log(`${name} left the chat`)
})

