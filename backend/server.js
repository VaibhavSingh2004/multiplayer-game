const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 5000;
const TARGET_VALUE = 20; // Predefined target value

let winner = null;

// WebSocket connections
wss.on('connection', function connection(ws) {
  console.log('New client connected');
  
  // Handle incoming messages from clients
  ws.on('message', function incoming(message) {
    const number = parseInt(message);
    console.log(number);
    if (!isNaN(number) && winner === null) {
      if (number === TARGET_VALUE) {
        console.log(number);
        // Set the winner to the current user
        winner = ws;
        // Notify the winner
        ws.send('Congratulations! You won the game!');
        // Notify all other users that they lost the game
        wss.clients.forEach(client => {
          if (client !== winner && client.readyState === WebSocket.OPEN) {
            client.send('Sorry, you lost the game!');
          }
        });
      }
    }
  });
  
  // Handle client disconnection
  ws.on('close', function close() {
    console.log('Client disconnected');
    // If the winner disconnects, reset the winner
    if (winner === ws) {
      winner = null;
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
