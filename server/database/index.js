const mongoose = require('mongoose');
const BingoGame = require('./bingo-game');

const uri = process.env.MONGO_DB_CONNECTION_URL;

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const { connection } = mongoose;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

module.exports = {
  BingoGame,
};
