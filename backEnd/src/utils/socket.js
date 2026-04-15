// Socket.IO server setup for real-time notifications
const { Server } = require('socket.io');
let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*', // Adjust as needed for production
      methods: ['GET', 'POST', 'PATCH'],
    },
  });

  io.on('connection', (socket) => {
    // Listen for user joining their notification room
    socket.on('join', (userId) => {
      socket.join(userId);
    });
  });
}

function sendNotification(userId, notification) {
  if (io) {
    io.to(userId).emit('notification', notification);
  }
}

module.exports = { initSocket, sendNotification };
