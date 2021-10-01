import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';
import { io } from 'socket.io-client';
import FlexContainer from '../common/flex-container/FlexContainer';
import styles from './CurrentGames.module.css';
import axios from '../../utils/axios';
import { BASE_API_URL } from '../../utils/constants';

const socket = io(BASE_API_URL);
export default function CurrentGames({ gameType, onAction }) {
  const isHost = gameType === 'host';
  const [currentGames, setCurrentGames] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    axios.get('/current-games').then(({ data }) => {
      setCurrentGames(data);
    });
    socket.emit('join-host-channel');
  }, []);

  useEffect(() => {
    socket.on('updated-player-count', () => {
      axios.get('/current-games').then(({ data }) => {
        setCurrentGames(data);
      });
    });
  }, []);

  const newGame = () => {
    axios.post('/create-game')
      .then(({ data }) => {
        setCurrentGames([...currentGames, data]);
      });
  };

  return (
    <FlexContainer
      alignItems="stretch"
      flexDirection="column"
      className={classNames(styles.currentGames, {
        [styles.collapsed]: !!collapsed,
      })}
    >
      <FlexContainer justifyContent="flex-end">
        <Button style={{ margin: '5px' }} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? 'Show' : 'Hide'}
        </Button>
      </FlexContainer>
      {!collapsed && (
      <>
        <div className={styles.title}>Current Games</div>
        {isHost && (
        <FlexContainer className={styles.newGame} alignSelf="center">
          <Button onClick={newGame} size="lg"> New Game </Button>
        </FlexContainer>
        )}
        {currentGames && currentGames.map((currentGame) => (
          <FlexContainer
            key={currentGame.gameCode}
            justifyContent="space-between"
            alignSelf="center"
            style={{ paddingRight: '20px', paddingBottom: '20px', width: '275px' }}
          >
            <div>{`(${currentGame.currentPlayerCount})`}</div>
            <div>{currentGame.gameCode}</div>
            <Button onClick={() => onAction(currentGame.gameCode)}>{isHost ? 'Host' : 'Join'}</Button>
          </FlexContainer>
        ))}
      </>
      )}
    </FlexContainer>
  );
}

CurrentGames.propTypes = {
  gameType: PropTypes.oneOf(['host', 'player']).isRequired,
  onAction: PropTypes.func,
};

CurrentGames.defaultProps = {
  onAction: null,
};
