var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const { dbUrl } = require("../config/dbConfig");
const { chickenModel } = require("../models/chickenModels.js");
const { userModel } = require("../models/userModels.js");
const {
  hashPassword,
  hashCompare,
  createToken,
  decodeToken,
  validate,
} = require("../config/auth");
const jwt = require("jsonwebtoken");

// mongoose.set("strictQuery", true);
mongoose.connect(dbUrl);

router.post("/create_chicken", async (req, res) => {
  let doc = new chickenModel(req.body);
  console.log(doc);
  await doc.save();
  res.status(201).send({
    message: "Chicken Created successfully",
  });
});

router.post("/registration", async (req, res) => {
  let doc = new userModel(req.body);
  console.log(doc);
  await doc.save();
  res.status(201).send({
    message: "User Created successfully",
  });
});

router.get("/get_chicken", async (req, res) => {
  let pizzas = await chickenModel.find({});
  res.send({
    pizzas,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.find({ email, password });
    console.log(user);
    if (user.length > 0) {
      const currentuser = {
        name: user[0].name,
        email: user[0].email,
        isAdmin: user[0].isAdmin,
        _id: user[0]._id,
      };
      res.send(currentuser);
    }

    //   res.send("User Logged in Successfully")
    //   if (await hashCompare(req.body.password, user.password)) {
    //     let token = createToken({
    //       name: user.name,
    //       email: user.email,
    //       password: user.password,

    //       role: user.role,
    //     });
    //     console.log(token);

    //     res
    //       .status(200)
    //       .send({ meassage: "Login Successful", token, role: user.role });
    //   } else {
    //     res.status(400).send({ message: "Invalid credentials" });
    //   }
    // } else {
    //   res.send({ message: "Email doesnot exists" });
    // }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

router.get("/getchicken", async (req, res) => {
  res.send("hello world");
});

module.exports = router;
