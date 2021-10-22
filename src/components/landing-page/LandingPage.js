import React, { useEffect, useState } from 'react';
import Mondrian from 'mondrian-art';
import SaveSvgAsPng from 'save-svg-as-png';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import FlexContainer from '../common/flex-container/FlexContainer';
import styles from './LandingPage.module.css';
import CheckoutForm from '../checkout-form/CheckoutForm';

const mondrianContainerId = 'my-mondrian';
let mondrian;

const LandingPage = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState();

  const downloadMondrian = () => {
    SaveSvgAsPng.saveSvgAsPng(document.getElementById(mondrianContainerId).children[0], 'my-mondrian.png');
  };

  useEffect(() => {
    mondrian = new Mondrian({
      container: document.getElementById(mondrianContainerId),
      width: 800,
      height: 800,
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
        <div id="my-mondrian" />
        <FlexContainer justifyContent="center" className={styles.controls}>
          <Button type="button" onClick={downloadMondrian}>Download</Button>
          <Button
            type="button"
            style={{ marginLeft: '1em' }}
            onClick={() => {
              mondrian.generate();
            }}
          >
            Generate
          </Button>
          <Button type="button" style={{ marginLeft: '1em' }} onClick={() => setIsPaymentModalOpen(true)}>Order</Button>
        </FlexContainer>
      </div>
      <Modal
        isOpen={isPaymentModalOpen}
        style={customStyles}
        onRequestClose={() => setIsPaymentModalOpen(false)}
        contentLabel="Order Form"
        ariaHideApp={false}
      >
        <FlexContainer alignItems="stretch" flexDirection="column">
          <CheckoutForm onClose={() => setIsPaymentModalOpen(false)} />
        </FlexContainer>
      </Modal>
    </FlexContainer>
  );
};

export default LandingPage;
