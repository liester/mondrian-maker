import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';
import styles from './Button.module.css';
// eslint-disable-next-line react/prop-types
export default function Button({ children, ...rest }) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <BootstrapButton className={styles.button} {...rest}>{children}</BootstrapButton>;
}
