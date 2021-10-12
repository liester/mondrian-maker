import React from 'react';
import FlexContainer from '../common/flex-container/FlexContainer';
import styles from './Header.module.css';

const Header = () => (
  <FlexContainer justifyContent="center" className={styles.header}>
    Mondrian Maker
  </FlexContainer>
);

export default Header;
