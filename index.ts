import express from "express";
import httpServer from "http";
import {Server, Socket} from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const http = new httpServer.Server(app)
const port = 3000;

const io = new Server(http);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function (socket: Socket) {
  console.log("A user connected", socket.id);

  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function () {
    console.log("A user disconnected", socket.id);
  });
});

// API to join chat arg: chat_code

http.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
