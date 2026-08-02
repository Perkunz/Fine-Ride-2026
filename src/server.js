const http = require('http');
const app = require('./app');
const config = require('./config');
const setupSocket = require('./socket');

const server = http.createServer(app);
const io = setupSocket(server);

server.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
