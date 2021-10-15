const mongoose = require('mongoose');

const { Schema } = mongoose;

const Mondrian = new Schema({
  buyerAddress: String,
  buyerName: String,
  paymentSuccessful: String,
  paymentId: String,
  mondrianDataUri: String,
}, { timestamps: true });

module.exports = mongoose.model('mondrianorders', Mondrian);
