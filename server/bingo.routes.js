const { generateNumbersForGame } = require('./bingo-generator');
const { BingoGame } = require('./database');

module.exports = (app, io) => {
  app.post('/create-game', async (req, res) => {
    let gameCode = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      gameCode += characters.charAt(Math.floor(Math.random()
          * charactersLength));
    }
    const availableNumbers = generateNumbersForGame();
    const createdBingoGame = await BingoGame.create({
      gameCode,
      availableNumbers,
    });
    res.json(createdBingoGame);
  });

  app.get('/current-games', async (req, res) => {
    const currentGameModels = await BingoGame.find({}).select('gameCode currentPlayerCount');
    res.json(currentGameModels);
  });

  app.get('/get-called-numbers/:gameCode', async (req, res) => {
    const { gameCode } = req.params;
    const currentGameModel = await BingoGame.findOne({ gameCode });
    if (!currentGameModel) {
      res.status(500).json({ error: 'No game code found' });
    }
    const previouslyCalledNumbers = currentGameModel.calledNumbers;
    res.json(previouslyCalledNumbers);
  });

  app.post('/call-next-number', async (req, res) => {
    const { gameCode } = req.body;
    if (!gameCode) {
      return;
    }
    const currentGame = await BingoGame.findOne({ gameCode });
    const numberToCall = currentGame && currentGame.availableNumbers && currentGame.availableNumbers.pop();
    if (!numberToCall) {
      res.status(500).json({ error: `No numbers left for game: ${gameCode} .  Someone should have won by now` });
    } else {
      await BingoGame.findByIdAndUpdate(currentGame._id,
        {
          availableNumbers: currentGame.availableNumbers,
          $push: { calledNumbers: numberToCall },
        });
      io.to(gameCode).emit('next-number', numberToCall);
      res.json({ nextNumber: numberToCall });
    }
  });

  app.delete('/delete-game/:gameCode', async (req, res) => {
    const { gameCode } = req.params;
    await BingoGame.findOneAndDelete({ gameCode });
    res.send();
  });
};
