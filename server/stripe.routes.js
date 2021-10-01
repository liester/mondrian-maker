const Stripe = require('stripe');

const stripe = Stripe('pk_test_wRF6cGM6D9azfHyN4dWcDXPG');// FIXME This needs to be a secret key, not public, get from stripe account
const { MondrianOrder } = require('./database');

const generateResponse = (intent) => {
  // Note that if your API version is before 2019-02-11, 'requires_action'
  // appears as 'requires_source_action'.
  if (
    intent.status === 'requires_action'
      && intent.next_action.type === 'use_stripe_sdk'
  ) {
    // Tell the client to handle the action
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret,
    };
  } if (intent.status === 'succeeded') {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    return {
      success: true,
    };
  }
  // Invalid status
  return {
    error: 'Invalid PaymentIntent status',
  };
};

module.exports = (app) => {
  app.post('/pay', async (request, response) => {
    try {
      let intent;
      if (request.body.payment_method_id) {
        // Create the PaymentIntent
        intent = await stripe.paymentIntents.create({
          payment_method: request.body.payment_method_id,
          amount: 999,
          currency: 'usd',
          confirmation_method: 'manual',
          confirm: true,
        });
      } else if (request.body.payment_intent_id) {
        intent = await stripe.paymentIntents.confirm(
          request.body.payment_intent_id,
        );
      }
      // Send the response to the client
      response.send(generateResponse(intent));
    } catch (e) {
      // Display error on client
      response.send({ error: e.message });
    }
  });
};
