const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Use your secret key

admin.initializeApp();

exports.createPaymentIntent = functions.https.onRequest(async (req: any, res: any) => {
  try {
    const { name, email, amount } = req.body;

    if (!name || !email || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a customer if they don't exist
    let customer;
    const customers = await stripe.customers.list({ email });
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({ name, email });
    }

    // Create an ephemeral key for the customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-06-20" }
    );

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount) * 100, // Convert to cents
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    return res.status(200).json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return res.status(500).json({ error: error.message });
  }
});


// import express, { Request, Response } from 'express';

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// export async function createPaymentIntent(req: Request, res: Response) {
//   try {
//     const { name, email, amount } = req.body;

//     if (!name || !email || !amount) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     let customer;
//     const doesCustomerExist = await stripe.customers.list({
//       email,
//     });

//     if (doesCustomerExist.data.length > 0) {
//       customer = doesCustomerExist.data[0];
//     } else {
//       const newCustomer = await stripe.customers.create({
//         name,
//         email,
//       });

//       customer = newCustomer;
//     }

//     const ephemeralKey = await stripe.ephemeralKeys.create(
//       {customer: customer.id},
//       {apiVersion: '2024-10-28.acacia'}
//     );

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: parseInt(amount) * 100,
//       currency: "usd",
//       customer: customer.id,
//       automatic_payment_methods: {
//         enabled: true,
//         allow_redirects: "never",
//       },
//     });

//     res.status(200).json({
//       paymentIntent: paymentIntent,
//       ephemeralKey: ephemeralKey,
//       customer: customer.id,
//     });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// }
