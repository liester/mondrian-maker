const mongoose = require('mongoose');

const { Schema } = mongoose;

const BingoGame = new Schema({
  gameCode: String,
  availableNumbers: [{ type: String }],
  calledNumbers: [{ type: String }],
  startDate: Date,
  endDate: Date,
  createdDate: {
    type: Date,
    default: Date.now,
  },
  currentPlayerCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('BingoGame', BingoGame);
