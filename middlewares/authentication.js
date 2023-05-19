const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: payload._id, tokens: token }); // tokens: token - changed after user model/login was changed to one token only
    if (!user) {
      console.log(user);
      return res.status(401).send("Unauthorised request");
    }
    req.user = user;
    console.log(req.user._id + " authenticated");
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error with token");
  }
};

module.exports = { authentication };
