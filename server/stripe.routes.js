const Stripe = require('stripe');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = Stripe(stripeSecretKey);
const mondrianService = require('./mondrian.service');

const { Mondrian } = require('./database');

const mondrianPriceInCents = 499;

const generateResponse = async (intent, billingDetails, address, mondrianDataUri, mondrianId) => {
  if (
    intent.status === 'requires_action'
      && intent.next_action.type === 'use_stripe_sdk'
  ) {
    // Tell the client to handle the action
    // create mondrian record with paymentSuccessful: false
    const mondrian = await Mondrian.create({
      buyerEmail: billingDetails.email,
      buyerName: billingDetails.name,
      buyerAddress: `${address.line1} ${address.city}, ${address.state} ${address.postal_code}`,
      paymentSuccessful: false,
      paymentId: intent.id,
      mondrianDataUri,
    });
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret,
      mondrianId: mondrian._id,
    };
  } if (intent.status === 'succeeded') {
    // The payment did not need any additional actions and completed!
    // Handle post-payment fulfillment
    let mondrian;
    if (mondrianId) {
      mondrian = await Mondrian.findByIdAndUpdate(mondrianId, { paymentSuccessful: true }, { new: true });
    } else {
      mondrian = await Mondrian.create({
        buyerEmail: billingDetails.email,
        buyerName: billingDetails.name,
        buyerAddress: `${address.line1} ${address.city}, ${address.state} ${address.postal_code}`,
        paymentSuccessful: true,
        paymentId: intent.payment_method,
        phoneNumber: billingDetails.phone,
        mondrianDataUri,
      });
    }
    await mondrianService.orderMondrian(mondrian.mondrianDataUri, billingDetails, address, intent.payment_method, mondrianPriceInCents);
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
    const { billingDetails, address, mondrianDataUri } = request.body;
    try {
      let intent;
      if (request.body.payment_method_id) {
        // Create the PaymentIntent
        intent = await stripe.paymentIntents.create({
          payment_method: request.body.payment_method_id,
          amount: mondrianPriceInCents,
          currency: 'usd',
          // confirmation_method: 'manual', // Not sure what the difference is here: https://stripe.com/docs/api/payment_intents/object#payment_intent_object-confirmation_method
          confirm: true,
        });
      } else if (request.body.payment_intent_id) {
        intent = await stripe.paymentIntents.confirm(
          request.body.payment_intent_id,
        );
      }
      // Send the response to the client
      const paymentResponse = await generateResponse(intent, billingDetails, address, mondrianDataUri);
      response.send(paymentResponse);
    } catch (e) {
      // Display error on client
      response.send({ error: e.message });
    }
  });
};
