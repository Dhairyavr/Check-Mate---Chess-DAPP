const express = require("express"); // using express
const socketIO = require("socket.io");
const http = require("http");
let app = express();

let server = http.createServer(app);
let io = socketIO(server);
let games = {};
io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("JoinGame", (room_id, user_address) => {
    console.log("room id ", room_id);

    if (!games.hasOwnProperty(room_id.toString())) {
      games[room_id] = {
        c: 1,
        sockets: [socket.id],
        addresses: [user_address],
      };
      console.log(games);
    } else if (games[room_id].c < 2) {
      games[room_id].c += 1;
      games[room_id].sockets = [...games[room_id].sockets, socket.id];
      games[room_id].addresses = [...games[room_id].addresses, user_address];
      console.log(games);
      if (games[room_id].c == 2) {
        socket.emit(
          "StartGame",
          "black",
          games[room_id].sockets[0],
          games[room_id].addresses[0]
        );
        socket
          .to(games[room_id].sockets[0])
          .emit(
            "StartGame",
            "white",
            games[room_id].sockets[1],
            games[room_id].addresses[1]
          );
      }

      console.log(games);
    } else {
      socket.emit("full", room_id);
      return;
    }
  });

  socket.on("move", (fen, room_id, socket_id, history) => {
    console.log("Fen", fen, history);
    socket.to(socket_id).emit("UpdatedMoves", fen, history);
  });

  socket.on("Result", (room_id, winner) => {
    console.log("Winner is", winner, games);
    socket.to(games[room_id].sockets[0]).emit("Winner", winner);
    socket.to(games[room_id].sockets[1]).emit("Winner", winner);
  });

  socket.on("Error", (socket_id) => {
    console.log("error", socket_id);
    socket.to(socket_id).emit("Status", "No more players allowed");
  });
});

server.listen(8000, () => {
  console.log("server started");
});
