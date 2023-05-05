const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRound = 10;
const secretKey = "lkhhfalshflk";

const hashPassword = async (password) => {
  let salt = await bcrypt.genSalt(saltRound);
  console.log(salt);
  let hash = await bcrypt.hash(password, salt);
  console.log(hash);
  return hash;
};

const hashCompare = (password, hash) => {
  return bcrypt.compare(password, hash);
};

const createToken = ({ firstName, lastName, email, role }) => {
  let token = jwt.sign({ firstName, lastName, email, role }, secretKey, {
    expiresIn: "30d",
  });
  return token;
};

const decodeToken = (token) => {
  let data = jwt.decode(token);
  return data;
};
