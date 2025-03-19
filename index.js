const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`User connected!`);

  socket.on("joinRoom", ({ user, room }) => {
    socket.user = user;
    socket.room = room;
    socket.join(room);
    io.to(socket.room).emit("userJoined", { user, room });
  });

  socket.on("chatMessage", (msg) => {
    io.to(socket.room).emit("chatMessage", {
      sender: socket.id,
      msg,
      user: socket.user,
    });
  });

  socket.on("leaveRoom", () => {
    io.to(socket.room).emit("leaveRoom", { user: socket.user });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected!");
    if (socket.room) {
      io.to(socket.room).emit("leaveRoom", { user: socket.user });
    }
  });
});

server.listen(process.env.PORT || 3000, "0.0.0.0,", () => {
  console.log(`Server is up and running on port 3000!`);
});
