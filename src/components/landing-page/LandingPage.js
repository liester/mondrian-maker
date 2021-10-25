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
    <FlexContainer flex={1}>
      <FlexContainer className={styles.infoColumn} justifyContent="center" flexDirection="column">
        <div className={styles.card}>
          <div><b>Who is Piet Mondrian?</b></div>
          {`Piet Mondrian was a Dutch painter and art theoretician who is regarded as one of the greatest artists of the 20th century.
          He is known for being one of the pioneers of 20th-century abstract art, as he changed his artistic direction from figurative 
          painting to an increasingly abstract style, until he reached a point where his artistic vocabulary was reduced to simple geometric elements.`}
        </div>
        <div className={styles.card}>
          <div><b>Why should I order a print?</b></div>
          {`Art is an interesting experience.  Some art fills us with feelings we can't understand while other art simply bores.
          If you find yourself moved by something you see and what a print on quality card stock, order it.  
          If you just want to capture it, feel free to download your Mondrian (for free) and do whatever you find fulfilling.`}
        </div>
      </FlexContainer>
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
    </FlexContainer>
  );
};

export default LandingPage;
