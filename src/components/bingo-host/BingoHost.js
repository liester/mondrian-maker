import React, { useState } from 'react';
import FlexContainer from '../common/flex-container/FlexContainer';
import axios from '../../utils/axios';
import CurrentGames from '../current-games/CurrentGames';
import Button from '../common/button/Button';

const BingoHost = () => {
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [hostingGame, setHostingGame] = useState();

  const callNextNumber = (gameCode) => {
    axios.post('/call-next-number', { gameCode })
      .then(({ data }) => {
        setCalledNumbers([data.nextNumber, ...calledNumbers]);
      });
  };

  const hostGame = (gameCode) => {
    setHostingGame(gameCode);
    axios.get(`/get-called-numbers/${gameCode}`)
      .then(({ data }) => {
        const previouslyCalledNumbers = data;
        setCalledNumbers(previouslyCalledNumbers);
      });
  };

  return (
    <FlexContainer flexDirection="row" flex={1}>
      <CurrentGames gameType="host" onAction={hostGame} />
      <FlexContainer flexDirection="column" flex={1} alignItems="center" gutters>
        {hostingGame && (
        <FlexContainer flexDirection="column">
          <div>{`Hosting Game: ${hostingGame}`}</div>
          <Button onClick={() => callNextNumber(hostingGame)}>Call Next Number</Button>
        </FlexContainer>
        )}
        {!!calledNumbers.length && calledNumbers.map((number) => (
          <div key={number}>{number}</div>
        ))}
      </FlexContainer>
    </FlexContainer>
  );
};
export default BingoHost;
