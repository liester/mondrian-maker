import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
import Mondrian from 'mondrian-art';
import SaveSvgAsPng from 'save-svg-as-png';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import FlexContainer from '../common/flex-container/FlexContainer';
import styles from './LandingPage.module.css';
import CheckoutForm from '../checkout-form/CheckoutForm';
import axios from '../../utils/axios';

const mondrianContainerId = 'my-mondrian';
let mondrian;

const LandingPage = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState();
  const [mondrianDataUri, setMondrianDataUri] = useState();

  const downloadMondrian = () => {
    SaveSvgAsPng.saveSvgAsPng(document.getElementById(mondrianContainerId).children[0], 'my-mondrian.png');
  };

  useEffect(() => {
    mondrian = new Mondrian({
      container: document.getElementById(mondrianContainerId),
      width: 900,
      height: 900,
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

  const sendMondrianToServer = async () => {
    const dataURI = await SaveSvgAsPng.svgAsPngUri(document.getElementById(mondrianContainerId).children[0]);

    axios.post('/saveMondrian', { mondrianDataUri: dataURI })
      .then(() => {
        setMondrianDataUri(dataURI);
      });
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
          <Button type="button" style={{ marginLeft: '1em' }} onClick={() => sendMondrianToServer()}>Send It!</Button>
        </FlexContainer>
      </div>
      <FlexContainer>
        <div>mondrain data uri</div>
        {mondrianDataUri && <img alt="clone data" src={mondrianDataUri} style={{ width: 300, height: 300 }} />}
      </FlexContainer>
      <Modal
        isOpen={isPaymentModalOpen}
        style={customStyles}
        onRequestClose={() => setIsPaymentModalOpen(false)}
        contentLabel="Order Form"
        ariaHideApp={false}
      >
        <FlexContainer className={styles.stripeContainer} alignItems="stretch">
          <CheckoutForm onClose={() => setIsPaymentModalOpen(false)} />
        </FlexContainer>
      </Modal>
    </FlexContainer>
  );
};

export default LandingPage;
