const { Server } = require('socket.io');
const { BingoGame } = require('./database');

const socketMap = {};

const hostMap = {};

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', async () => {
      const socketCurrentGame = socketMap[socket.id];
      console.log(`Disconnected: Socket ${socket.id} leaving bingo game: ${socketCurrentGame}`);
      if (socketCurrentGame) {
        const updatedBingoGame = await BingoGame.findOneAndUpdate({ gameCode: socketCurrentGame }, { $inc: { currentPlayerCount: -1 } }, { new: true });
        console.log(`Updated Player Count for ${socketCurrentGame}: ${updatedBingoGame.currentPlayerCount}`);
        io.to(socketCurrentGame).to('hosts').emit('updated-player-count');
      } else {
        console.log('Socket not in game, not updating player count');
      }
    });

    socket.on('join-game', async (gameCode) => {
      if (socketMap[socket.id]) {
        socket.leave(socketMap[socket.id]);
        console.log(`Socket ${socket.id} left bingo game: ${socketMap[socket.id]}`);
        const updatedBingoGame = await BingoGame.findOneAndUpdate({ gameCode }, { $inc: { currentPlayerCount: -1 } }, { new: true });
        console.log(`Updated Player Count for ${gameCode}: ${updatedBingoGame.currentPlayerCount}`);
        io.to(gameCode).to('hosts').emit('updated-player-count');
      }

      socket.join(gameCode);
      console.log(`Socket ${socket.id} joined bingo game: ${gameCode}`);
      const updatedBingoGame = await BingoGame.findOneAndUpdate({ gameCode }, { $inc: { currentPlayerCount: 1 } }, { new: true });
      console.log(`Updated Player Count for ${gameCode}: ${updatedBingoGame.currentPlayerCount}`);
      io.to(gameCode).to('hosts').emit('updated-player-count');
      socketMap[socket.id] = gameCode;
    });

    socket.on('join-host-channel', () => {
      socket.join('hosts');
      console.log(`New Host Joined: ${socket.id}`);
      hostMap[socket.id] = socket.id;
    });
  });
  return io;
};
