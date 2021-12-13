import Order from "../models/OrderSchema.js";
import Product from "../models/ProductSchema.js";

import { checkPermissions } from "../utils/index.js";

const fakeStripeApi = async ({ amount, currency }) => {
  const client_secret = "randomValueSecret";
  return { client_secret, amount };
};

export const createOrder = async (req, res) => {
  const { item: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || !cartItems.length) {
    res.status(500).send({ msg: "No cart items provided" });
  }

  if (!tax || !shippingFee) {
    res.status(500).send({ msg: "Please provide shipping fees" });
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      res.status(500).send({ msg: `no product with this ${item.product} ` });
    }

    const { name, price, image, _id } = dbProduct;

    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };

    //add item to the order
    orderItems = [...orderItems, singleOrderItem];
    //calculate subtotal
    subtotal += item.amount * price;
    //or subtotal = subtotal + item.amount * price
  }
  // calculate total
  const total = shippingFee + tax + subtotal;
  //get client secret
  const paymentIntent = await fakeStripeApi({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems,
    subtotal,
    total,
    shippingFee,
    tax,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res.status(200).json({ order, clientSecret: order.clientSecret });
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

export const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    res.status(204).send({ msg: `No order with id : ${orderId}` });
  }

  checkPermissions(req.user, order.user);
  res.status(204).json({ order });
};

export const getCurrentUserOrders = async (req, res) => {
  const order = await Order.find({ user: req.user.userId });
  res.status(205).json({ order, count: order.length });
};

export const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;

  const { paymentIntentId } = req.body;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    res.status(204).send({ msg: `No order with id : ${orderId}` });
  }

  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await Order.save();
  res.status(205).json({ order });
};
