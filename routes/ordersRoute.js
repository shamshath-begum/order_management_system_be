var express = require("express");
var router = express.Router();
const stripe = require("stripe")(
  "sk_test_51N3eh3SHNBZiBdpK3dYZBP2AFDKIPQojVLhwiIBrWAveBfKe1HcagBtom6LjAWC6dv4dPjERBoYR92IehhBFHFkk00ywdcouYo"
);
const { v4: uuidv4 } = require("uuid");
const { orderModel } = require("../models/orderModel.js");

router.post("/placeorder", async (req, res) => {
  const { token, subTotal, currentUser, cartItems } = req.body;
  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.charges.create(
      {
        amount: subTotal * 100,
        currency: "inr",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );
    if (payment) {
      const neworder = new orderModel({
        name: currentUser.name,
        email: currentUser.email,
        userid: currentUser._id,
        orderItems: cartItems,
        orderAmount: subTotal,
        shippingAddress: {
          street: token.card.address_line1,
          city: token.card.address_city,
          country: token.card.address_country,
          pincode: token.card.address_zip,
        },
        transactionId: payment.source.id,
      });
      neworder.save();
      res.send("payment Done");
    } else {
      res.send("payment failed");
    }
  } catch (error) {
    return res.status(400).json({ message: "something went wrong" });
  }
});

router.post("/getuserorders", async (req, res) => {
  const { userid } = req.body;
  try {
    const orders = await orderModel.find({ userid: userid });
    res.send(orders);
  } catch (error) {
    return res.status(400).json({ message: "something went wrong" });
  }
});

module.exports = router;
