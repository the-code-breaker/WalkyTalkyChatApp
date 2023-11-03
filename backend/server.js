const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require("./routes/messageRoutes");
dotenv.config();

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
connectDB();

const app = express();
app.use(express.json());
// app.get('/', (req, res) => {
//     res.send("started");
// })

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// ---------------deployment-----------------//
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname1, 'frontend', 'dist');
  console.log('Static Path:', staticPath); // Log the static path
  app.use(express.static(staticPath));

  app.get('*', (req, res) => {
    const indexPath = path.resolve(__dirname1, 'frontend', 'dist', 'index.html');
    console.log('Index Path:', indexPath); // Log the index.html path
    res.sendFile(indexPath);
  });
}

else{
  app.get("/", (req, res)=>{
    res.send("API is Running Successfully")
  })
}



// app.get('/api/chats', (req, res) => {
//     res.send(chats);
// })

// app.get('/api/chats/:id', (req, res) => {
//     const singleChat = chats.find((c) => c._id === req.params.id);
//     res.send(singleChat);
// })

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket");
  socket.on("setup", (userData) => {
    console.log("Connected to socket");
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected"); 
  });

  socket.on('join chat', (room)=>{
        socket.join(room);
        console.log("User Joined Room: " + room)
  })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});


