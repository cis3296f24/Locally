import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email' }),
        { status: 400 }
      );
    }

    // Check if the customer already exists
    const existingCustomers = await stripe.customers.list({ email });
    let customer;

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      // Create a new customer if not found
      customer = await stripe.customers.create({ email });
    }

    // Create a subscription for the customer
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.STRIPE_PRICE_ID }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;

    return new Response(
      JSON.stringify({
        customer: customer.id,
        subscription: subscription.id,
        latest_invoice: {
          id: latestInvoice.id,
          payment_intent: {
            id: paymentIntent.id,
            client_secret: paymentIntent.client_secret,
          },
        },
      })
    );
  } catch (error: any) {
    console.error('Error creating subscription:', error.message);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
