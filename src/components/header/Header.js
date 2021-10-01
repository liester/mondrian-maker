import React from 'react';
import FlexContainer from '../common/flex-container/FlexContainer';
import styles from './Header.module.css';

const Header = () => (
  <FlexContainer justifyContent="space-between" className={styles.header} />
);

export default Header;
