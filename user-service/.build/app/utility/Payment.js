"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrievePayment = exports.CreatePaymentSession = exports.STRIPE_FEE = exports.APPLICATION_FEE = void 0;
const stripe_1 = __importDefault(require("stripe"));
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISH_KEY = process.env.STRIPE_PUBLISH_KEY;
const APPLICATION_FEE = (totalAmount) => {
    const appFee = 1.5;
    return (totalAmount / 100) * appFee;
};
exports.APPLICATION_FEE = APPLICATION_FEE;
const STRIPE_FEE = (totalAmount) => {
    const perTransaction = 2.9; //i.e 2.9%
    const fixCost = 0.29;
    const stripeCost = (totalAmount / 100) * perTransaction;
    return stripeCost + fixCost;
};
exports.STRIPE_FEE = STRIPE_FEE;
const stripe = new stripe_1.default(STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16",
});
const CreatePaymentSession = ({ email, phone, amount, customerId, }) => __awaiter(void 0, void 0, void 0, function* () {
    let currentCustomerId;
    if (customerId) {
        const customer = yield stripe.customers.retrieve(customerId);
        currentCustomerId = customer.id;
    }
    else {
        const customer = yield stripe.customers.create({ email });
        currentCustomerId = customer.id;
    }
    const { client_secret, id } = yield stripe.paymentIntents.create({
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
});
exports.CreatePaymentSession = CreatePaymentSession;
const RetrievePayment = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    return stripe.paymentIntents.retrieve(paymentId);
});
exports.RetrievePayment = RetrievePayment;
//# sourceMappingURL=Payment.js.map