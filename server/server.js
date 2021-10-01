require('dotenv').config();
const path = require('path');
const cors = require('cors');
const express = require('express');

const app = express();

const BingoRoutes = require('./bingo.routes');
const SocketRoutes = require('./socket.routes');

const PORT = process.env.PORT || 5000;

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));
app.use(cors());
app.use(express.json());

const server = app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

const io = SocketRoutes(server);
BingoRoutes(app, io);

// Madness required for client side react router
app.get('/*', (req, res) => {
  console.log('No route found, attempting to return index.html');
  let url = path.join(__dirname, '../build', 'index.html');
  console.log(`URL:${url}`);
  if (!url.startsWith('/app/')) { // we're on local windows
    url = url.substring(1);
  }
  res.sendFile(url);
});
