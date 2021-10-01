import React, { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { BASE_API_URL } from '../../utils/constants';
import axios from '../../utils/axios';
import FlexContainer from '../common/flex-container/FlexContainer';
import speak from '../../utils/speak';
import BingoBall from '../bingo-ball/BingoBall';
import CurrentGames from '../current-games/CurrentGames';

const socket = io(BASE_API_URL);

const BingoGame = () => {
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [currentGames, setCurrentGames] = useState([]);
  const [currentGame, setCurrentGame] = useState();

  const joinGame = useCallback((gameCode) => {
    socket.emit('join-game', gameCode);
    setCurrentGame(gameCode);
  }, []);

  useEffect(() => {
    socket.on('next-number', (nextNumber) => {
      speak(nextNumber);
      setCalledNumbers((previousCalledNumbers) => {
        const previousNumber = previousCalledNumbers.pop();
        const filteredNumbers = [previousNumber, nextNumber].filter(Boolean);
        return filteredNumbers;
      });
    });
    socket.on('updated-player-count', () => {
      axios.get('/current-games').then(({ data }) => {
        setCurrentGames(data);
      });
    });
  }, [socket, setCalledNumbers, speak]);

  useEffect(() => {
    axios.get('/current-games').then(({ data }) => {
      setCurrentGames(data);
    });
  }, []);

  return (
    <FlexContainer flexDirection="row" flex={1}>
      <CurrentGames gameType="player" currentGames={currentGames} onAction={joinGame} />
      <FlexContainer flexDirection="column" flex={1} alignItems="center" gutters>
        {currentGame && (
        <div>{`Current Game: ${currentGame}`}</div>
        )}
        {!!calledNumbers.length && (
        <FlexContainer flexDirection="column">
          <FlexContainer justifyContent="space-around">
            {calledNumbers.length > 1 && <div>Previous</div>}
            <div>Current</div>
          </FlexContainer>
          <FlexContainer justifyContent="center" alignItems="center">
            {calledNumbers.map((number) => (
              <BingoBall style={{ margin: '0px 10px' }} key={number}>
                {number}
              </BingoBall>
            ))}
          </FlexContainer>
        </FlexContainer>
        )}
      </FlexContainer>
    </FlexContainer>
  );
};

export default BingoGame;
