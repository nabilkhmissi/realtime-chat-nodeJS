const express = require('express');
require('./connectDB')
const Room = require('./db/room')
const Message = require('./db/message')
const app = express();
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const httpServer = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(httpServer, {
    cors: { origin: '*' }
})
app.use(cors({
    origin: '*'
}))
app.use(express.json())
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);


io.on('connection', (socket) => {

    socket.on('join_room', async (roomJoin) => {
        try {
            let { user1, user2 } = roomJoin;
            let existRoom = await Room.findOne({ users: { $all: [user1._id, user2._id] } }).populate({
                path: 'messages',
                populate: {
                    path: 'sender',
                    model: 'User'
                }
            });
            if (!existRoom) {
                const new_room = new Room({});
                new_room.users.push(user1);
                new_room.users.push(user2);
                existRoom = await new_room.save();
            }
            socket.emit('joined_room', existRoom);
            socket.join(existRoom._id.toString());

        } catch (error) {
            console.log(error)
        }

    })

    socket.on('user is typing', (obj) => {
        io.to(obj.roomId).emit('user is typing', obj);
    })

    socket.on('message', async (message) => {
        try {
            let { sender, content, roomId } = message;
            if (roomId) {
                let currentRoom = await Room.findOne({ _id: roomId });

                let date = new Date(Date.now());
                const newMessage = await new Message({
                    sender: sender,
                    content: content,
                    creationDate: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                }).save();

                currentRoom.messages.push(newMessage)
                currentRoom.save();

                io.in(roomId).emit('message', {
                    sender: sender,
                    roomId: roomId,
                    content: content,
                    creationDate: newMessage.creationDate,
                    _id: newMessage._id
                });
            }
        } catch (error) {
            console.log(error)
        }
    })
    socket.on('disconnect', () => {
        console.log('a user disconnected!');
    });
});



const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`app is running on port :  ${PORT}`))