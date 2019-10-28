const express = require("express");
const app = express();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

const server = app.listen(3000, () => {
  console.log("App is working on port 3000");
});

const io = require("socket.io")(server);
let clients = [];
io.on("connection", socket => {
  console.log("A new client connected");

  socket.on("disconnect", () => {
    clients = clients.filter(client => client.socketId !== socket.id);
    io.emit("updateClients", clients);
  });

  socket.on("chatMessage", data => {
    console.log(data);
    io.emit("chatMessage", data);
  });

  socket.on("privateMessage", data => {
    console.log(data);
  });

  socket.on("newClient", name => {
    clients.push({ name, socketId: socket.id });
    io.emit("updateClients", clients);
  });
});
