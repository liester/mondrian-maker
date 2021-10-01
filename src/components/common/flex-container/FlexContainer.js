import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './FlexContainer.module.css';

const FlexContainer = (props) => {
  const {
    children, className, style, id, gutters, ...rest
  } = props;
  const defaultStyles = {
    display: 'flex',
    alignItems: 'stretch',
  };
  return (
    <div
      id={id}
      style={{
        ...defaultStyles, ...style, ...rest,
      }}
      className={classNames(className, {
        [styles.gutters]: gutters,
      })}
    >
      {children}
    </div>
  );
};

FlexContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  alignItems: PropTypes.oneOf([
    'stretch',
    'center',
    'flex-start',
    'flex-end',
    'baseline',
    'initial',
    'inherit',
  ]),
  justifyContent: PropTypes.oneOf([
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'initial',
    'inherit',
  ]),
  alignSelf: PropTypes.oneOf([
    'flex-start',
    'flex-end',
    'center',
  ]),
  flexDirection: PropTypes.oneOf(['row', 'column']),
  flex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.shape(),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  gutters: PropTypes.bool,
};

FlexContainer.defaultProps = {
  className: null,
  style: null,
  alignItems: null,
  justifyContent: null,
  flexDirection: null,
  flex: null,
  alignSelf: null,
  id: null,
  gutters: false,
};

export default FlexContainer;
