//Node server responsible to handle socket connections
const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
    }
  });

var users = {};

io.on('connection',socket => { //socket.io instance is io.on this listens to multiple socket.io connections
    socket.on('new-user-joined', name => { //when a particular connection is made socket.on handles it
        users[socket.id] = name; //socket.on whenever it finds user-joined event, it sets socket.id = name
        console.log("New user joined", name)
        console.log(`Added to entry ${users[socket.id]}`)
        socket.broadcast.emit('user-joined', name) //broadcasts to every other user that user has joined. This is a server emitted event gives username as well


    })

    socket.on('send', message => { //if server finds send event
        socket.broadcast.emit('receive', { // a receive event is emmitted by server and broadcasted to all users
            message: message, name: users[socket.id] //message and name goes
        })
    })

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id]
    })
})