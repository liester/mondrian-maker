import React, { useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
import Mondrian from 'mondrian-art';
import SaveSvgAsPng from 'save-svg-as-png';
import FlexContainer from '../common/flex-container/FlexContainer';
import styles from './LandingPage.module.css';

// import { loadStripe } from '@stripe/stripe-js'
// import {
//     Elements
// } from '@stripe/react-stripe-js'
// import CheckoutForm from './checkout-form/CheckoutForm'

const mondrianContainerId = 'my-mondrian';

// const stripePromise = loadStripe('pk_test_wRF6cGM6D9azfHyN4dWcDXPG');

const LandingPage = () => {
  // const history = useHistory();
  let mondrian;

  const downloadMondrian = () => {
    SaveSvgAsPng.saveSvgAsPng(document.getElementById(mondrianContainerId).children[0], 'my-mondrian.png');
  };

  useEffect(() => {
    mondrian = new Mondrian({
      container: document.getElementById(mondrianContainerId),
      width: 700,
      height: 700,
      mondrian: {
        style: 'classic',
      },
    });

    mondrian.generate();
  }, []);

  return (
    <FlexContainer justifyContent="center" flexDirection="column" alignItems="center" flex={1}>
      <div className="mondrianContainer">
        <FlexContainer justifyContent="center">My Mondrian</FlexContainer>
        <div id="my-mondrian" />
        <FlexContainer justifyContent="center" className={styles.controls}>
          <button type="button" onClick={downloadMondrian}>Download</button>
          <button type="button" style={{ marginLeft: '1em' }} onClick={() => mondrian.generate()}>Generate</button>
          <button type="button" style={{ marginLeft: '1em' }} onClick={() => mondrian.generate()}>Order</button>
        </FlexContainer>
      </div>
    </FlexContainer>
  );
  // return (
  //   <FlexContainer justifyContent="center" flexDirection="column" alignItems="center" flex={1}>
  //     <Button onClick={() => history.push('/game')} className={styles.megaButton}>Join Game</Button>
  //     <Button onClick={() => history.push('/host')} className={styles.megaButton}>Host Game</Button>
  //   </FlexContainer>
  // );
};

export default LandingPage;
