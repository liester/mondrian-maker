import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
import Mondrian from 'mondrian-art';
import SaveSvgAsPng from 'save-svg-as-png';
import Modal from 'react-modal';
import FlexContainer from '../common/flex-container/FlexContainer';
import styles from './LandingPage.module.css';
import CheckoutForm from '../checkout-form/CheckoutForm';

const mondrianContainerId = 'my-mondrian';

const LandingPage = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState();
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

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      height: '600px',
      width: '600px',
    },
  };
  return (
    <FlexContainer justifyContent="center" alignItems="center" flex={1}>
      <div className="mondrianContainer">
        <FlexContainer justifyContent="center">My Mondrian</FlexContainer>
        <div id="my-mondrian" />
        <FlexContainer justifyContent="center" className={styles.controls}>
          <button type="button" onClick={downloadMondrian}>Download</button>
          <button type="button" style={{ marginLeft: '1em' }} onClick={() => mondrian.generate()}>Generate</button>
          <button type="button" style={{ marginLeft: '1em' }} onClick={() => setIsPaymentModalOpen(true)}>Order</button>
        </FlexContainer>
      </div>
      <Modal
        isOpen={isPaymentModalOpen}
        style={customStyles}
        onRequestClose={() => setIsPaymentModalOpen(false)}
        contentLabel="Order Form"
      >
        <FlexContainer className={styles.stripeContainer} alignItems="stretch">
          <CheckoutForm onClose={() => setIsPaymentModalOpen(false)} />
        </FlexContainer>
      </Modal>
    </FlexContainer>
  );
};

export default LandingPage;
