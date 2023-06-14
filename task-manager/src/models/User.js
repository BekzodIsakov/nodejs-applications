const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const TaskModel = require("../models/Task");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: function (value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      trim: true,
      validate: function (value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password should not include 'password'");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await UserModel.findOne({ email });
  const ERROR_MSG = "Incorrect password or email";

  if (!user) {
    console.log("not found");
    throw new Error(ERROR_MSG);
  }

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  if (hashedPassword === user.password) {
    return user;
  }
  throw new Error(ERROR_MSG);
};

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ id: user._id.toString() }, "SecretKey");

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const hash = crypto
      .createHash("sha256")
      .update(user["password"])
      .digest("hex");
    user["password"] = hash;
  }

  next();
});

UserSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const user = this;
    console.log("deleteone");
    await TaskModel.deleteMany({ author: user._id });
    next();
  }
);

UserSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "author",
});

const UserModel = new mongoose.model("User", UserSchema);
module.exports = UserModel;
