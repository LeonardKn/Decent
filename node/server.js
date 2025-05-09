const path = require('path');
const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');

const app = express();
// Serve your static folder
app.use(express.static(path.join(__dirname, 'public')));

// Create HTTP server and attach ws
const server = createServer(app);
const wss = new WebSocket.Server({ server });


// Example ws handler
wss.on('connection', socket => {
  console.log('Client connected');
  socket.on('message', msg => {
    console.log('Received:', msg);
    socket.send(`Echo: ${msg}`);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`HTTP+WS server listening on http://localhost:${PORT}`);
});

