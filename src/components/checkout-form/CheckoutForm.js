import React, { useState } from 'react';
import {
  CardElement,
  useElements,
  useStripe,
  Elements,
} from '@stripe/react-stripe-js';
import './CheckoutForm.css';
import PropTypes from 'prop-types';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from 'react-bootstrap';
import SaveSvgAsPng from 'save-svg-as-png';
import axios from '../../utils/axios';

const stripePromise = loadStripe('pk_test_wRF6cGM6D9azfHyN4dWcDXPG');

// eslint-disable-next-line react/prop-types
const CardField = ({ onChange }) => (
  <div className="FormRow">
    <CardElement onChange={onChange} />
  </div>
);

const Field = ({
  label,
  id,
  type,
  placeholder,
  required,
  autoComplete,
  value,
  onChange,
}) => (
  <div className="FormRow">
    <label htmlFor={id} className="FormRowLabel">
      {label}
    </label>
    <input
      className="FormRowInput"
      id={id}
      type={type}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
    />
  </div>
);

Field.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  autoComplete: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

Field.defaultProps = {
  autoComplete: '',
};

// eslint-disable-next-line react/prop-types
const SubmitButton = ({
  // eslint-disable-next-line react/prop-types
  processing, error, children, disabled,
}) => (
  <button
    className={`SubmitButton ${error ? 'SubmitButton--error' : ''}`}
    type="submit"
    disabled={processing || disabled}
  >
    {processing ? 'Processing...' : children}
  </button>
);

// eslint-disable-next-line react/prop-types
const ErrorMessage = ({ children }) => (
  <div className="ErrorMessage" role="alert">
    <svg width="16" height="16" viewBox="0 0 17 17">
      <path
        fill="#FFF"
        d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
      />
      <path
        fill="#6772e5"
        d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
      />
    </svg>
    {children}
  </div>
);

const StripCheckoutForm = ({ onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    email: 'moneyroad@example.com',
    phone: '1235550987',
    name: 'Zenith Oshkosh',
  });
  const [address, setAddress] = useState({
    line1: '12 Temple Way',
    state: 'Aslan Country',
    postal_code: '12345',
    city: 'Narnia',
  });

  const handleStripeJsResult = (result, mondrianId) => {
    if (result.error) {
      // Show error in payment form
    } else {
      // The card action has been handled
      // The PaymentIntent can be confirmed again on the server
      fetch('/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_intent_id: result.paymentIntent.id, mondrianId }),
        // eslint-disable-next-line no-use-before-define
      }).then((confirmResult) => confirmResult.json()).then(handleServerResponse);
    }
  };

  const handleServerResponse = async (response) => {
    if (response.error) {
      // Show error from server on payment form
    } else if (response.requires_action) {
      // Use Stripe.js to handle required card action
      stripe.handleCardAction(
        response.payment_intent_client_secret,
      ).then((result) => {
        handleStripeJsResult(result, response.mondrianId);
      });
    } else {
      // Show success message
    }
  };

  const mondrianContainerId = 'my-mondrian';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    if (error) {
      elements.getElement('card').focus();
      return;
    }

    if (cardComplete) {
      setProcessing(true);
    }

    const payload = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: { ...billingDetails, address },
    });

    if (payload.error) {
      setError(payload.error);
      setProcessing(false);
    } else {
      const mondrianDataUri = await SaveSvgAsPng.svgAsPngUri(document.getElementById(mondrianContainerId).children[0]);
      axios.post('/pay', {
        payment_method_id: payload.paymentMethod.id, mondrianDataUri, billingDetails, address,
      })
        .then(({ data }) => {
          handleServerResponse(data);
          setPaymentMethod(payload.paymentMethod);
          setProcessing(false);
        });
    }
  };

  return paymentMethod
    ? (
      <div className="Result">
        <div className="ResultTitle" role="alert">
          Payment successful
        </div>
        <div className="ResultMessage">
          Thanks for ordering a personalized Mondrian.
          Order Number:
          {' '}
          {paymentMethod.id}
        </div>
        <Button onClick={onClose}>
          Finish
        </Button>
      </div>
    )
    : (
      <form className="Form" onSubmit={handleSubmit}>
        <fieldset className="FormGroup">
          <Field
            label="Name"
            id="name"
            type="text"
            placeholder="Jane Doe"
            required
            autoComplete="name"
            value={billingDetails.name}
            onChange={(e) => {
              setBillingDetails({ ...billingDetails, name: e.target.value });
            }}
          />
          <Field
            label="Email"
            id="email"
            type="email"
            placeholder="email@example.com"
            required
            autoComplete="email"
            value={billingDetails.email}
            onChange={(e) => {
              setBillingDetails({ ...billingDetails, email: e.target.value });
            }}
          />
          <Field
            label="Phone"
            id="phone"
            type="tel"
            placeholder="(941) 555-0123"
            required
            autoComplete="tel"
            value={billingDetails.phone}
            onChange={(e) => {
              setBillingDetails({ ...billingDetails, phone: e.target.value });
            }}
          />
          <Field
            label="Address"
            id="address"
            type="text"
            placeholder="42 Wallaby Way, Sydney"
            required
            value={address.line1}
            onChange={(e) => {
              setAddress({ ...address, line1: e.target.value });
            }}
          />
          <Field
            label="City"
            id="city"
            placeholder="Omaha"
            type="text"
            required
            value={address.city}
            onChange={(e) => {
              setAddress({ ...address, city: e.target.value });
            }}
          />
          <Field
            label="State"
            id="state"
            placeholder="Nebraska"
            type="text"
            required
            value={address.state}
            onChange={(e) => {
              setAddress({ ...address, state: e.target.value });
            }}
          />
          <Field
            label="Postal Code"
            id="postal_code"
            placeholder="68122"
            type="text"
            required
            value={address.postal_code}
            onChange={(e) => {
              setAddress({ ...address, postal_code: e.target.value });
            }}
          />
        </fieldset>
        <fieldset className="FormGroup">
          <CardField
            onChange={(e) => {
              console.log(e);
              setError(e.error);
              setCardComplete(e.complete);
            }}
          />
        </fieldset>
        {error && <ErrorMessage>{error.message}</ErrorMessage>}
        <SubmitButton processing={processing} error={error} disabled={!stripe}>
          Order $9.99
        </SubmitButton>
      </form>
    );
};

StripCheckoutForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};
const CheckoutForm = ({ onClose }) => (
  <Elements stripe={stripePromise}>
    <StripCheckoutForm onClose={onClose} />
  </Elements>
);
CheckoutForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};
export default CheckoutForm;
