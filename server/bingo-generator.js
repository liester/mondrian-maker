const allOptions = [
  'B 01',
  'B 02',
  'B 03',
  'B 04',
  'B 05',
  'B 06',
  'B 07',
  'B 08',
  'B 09',
  'B 10',
  'B 11',
  'B 12',
  'B 13',
  'B 14',
  'B 15',
  'I 16',
  'I 17',
  'I 18',
  'I 19',
  'I 20',
  'I 21',
  'I 22',
  'I 23',
  'I 24',
  'I 25',
  'I 26',
  'I 27',
  'I 28',
  'I 29',
  'I 30',
  'N 31',
  'N 32',
  'N 33',
  'N 34',
  'N 35',
  'N 36',
  'N 37',
  'N 38',
  'N 39',
  'N 40',
  'N 41',
  'N 42',
  'N 43',
  'N 44',
  'N 45',
  'G 46',
  'G 47',
  'G 48',
  'G 49',
  'G 50',
  'G 51',
  'G 52',
  'G 53',
  'G 54',
  'G 55',
  'G 56',
  'G 57',
  'G 58',
  'G 59',
  'G 60',
  'O 61',
  'O 62',
  'O 63',
  'O 64',
  'O 65',
  'O 66',
  'O 67',
  'O 68',
  'O 69',
  'O 70',
  'O 71',
  'O 72',
  'O 73',
  'O 74',
  'O 75',
];

function shuffle(array) {
  const shuffledArray = [...array];
  let m = array.length;
  let t;
  let i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = shuffledArray[m];
    shuffledArray[m] = shuffledArray[i];
    shuffledArray[i] = t;
  }

  return shuffledArray;
}

const generateNumbersForGame = () => shuffle(allOptions);

module.exports = {
  allOptions,
  generateNumbersForGame,
};
