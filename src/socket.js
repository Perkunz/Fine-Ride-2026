/***********************
 * socket.io setup
 ***********************/

const { Server } = require('socket.io');

function setupSocket(server) {
  const io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('driver:join', (payload) => {
      // payload: { driverId }
      socket.join(`driver:${payload.driverId}`);
      console.log('driver joined room', payload.driverId);
    });

    socket.on('driver:location', (payload) => {
      // payload: { driverId, lat, lng, rideId? }
      // broadcast to rider room(s) that are matched to the ride
      if (payload.rideId) {
        io.to(`ride:${payload.rideId}`).emit('ride:driverLocation', payload);
      }
      // also broadcast driver location generally
      io.to(`driver:${payload.driverId}`).emit('driver:location', payload);
    });

    socket.on('ride:subscribe', (payload) => {
      // payload: { rideId }
      socket.join(`ride:${payload.rideId}`);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id);
    });
  });

  return io;
}

module.exports = setupSocket;
