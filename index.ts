import express from "express";
import httpServer from "http";
import { Server, Socket } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { Producer } from "./src/producer";

const app = express();
const http = new httpServer.Server(app);
const port = 3000;

const io = new Server(http);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
  const producer = new Producer();
  await producer.createConfigMap();
  await producer.setProducer();
  setInterval(()=>{
    producer.sendMessage(new Date().toString())
  },3000)
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
