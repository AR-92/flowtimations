const http = require('http');
const routes = require('./routes');

const PORT = 3000;

const server = http.createServer((req, res) => {
  routes(req, res);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

