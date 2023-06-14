const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "SecretKey");
    console.log({ decoded, token });
    const user = await UserModel.findOne({
      _id: decoded.id,
      "tokens.token": token,
    });

    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
