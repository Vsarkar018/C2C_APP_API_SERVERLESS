import { CreatePaymentSessionInput } from "../models/dto/CreatePaymentSessionInput";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISH_KEY = process.env.STRIPE_PUBLISH_KEY;

export const APPLICATION_FEE = (totalAmount: number) => {
  const appFee = 1.5;
  return (totalAmount / 100) * appFee;
};

export const STRIPE_FEE = (totalAmount: number) => {
  const perTransaction = 2.9; //i.e 2.9%
  const fixCost = 0.29;
  const stripeCost = (totalAmount / 100) * perTransaction;
  return stripeCost + fixCost;
};

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export const CreatePaymentSession = async ({
  email,
  phone,
  amount,
  customerId,
}: CreatePaymentSessionInput) => {
  let currentCustomerId: string;
  if (customerId) {
    const customer = await stripe.customers.retrieve(customerId);
    currentCustomerId = customer.id;
  } else {
    const customer = await stripe.customers.create({ email });
    currentCustomerId = customer.id;
  }

  const { client_secret, id } = await stripe.paymentIntents.create({
    customer: currentCustomerId,
    payment_method_types: ["card"],
    amount: parseInt(`${amount * 100}`),
    currency: "inr",
  });
  return {
    secret: client_secret,
    publishableKey: STRIPE_PUBLISH_KEY,
    paymentId: id,
    customerId: currentCustomerId,
  };
};

export const RetrievePayment = async (paymentId: string) => {
  return stripe.paymentIntents.retrieve(paymentId);
};
