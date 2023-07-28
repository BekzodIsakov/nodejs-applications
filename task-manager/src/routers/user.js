const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const multer = require("multer");
const upload = multer({
  limits: { fileSize: 1e6 },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(
        new Error("Ivalid image format. Valid formats: jpg, jpeg and png")
      );
    }

    cb(null, true);
  },
});

const UserModel = require("../models/User");

router.post("/", async (req, res) => {
  const user = new UserModel(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    if (error.keyValue) {
      const key = Object.keys(error.keyValue);
      if (key) {
        return res.status(400).send({
          message: `${error.keyValue[key]} already exists. Please choose different ${key}.`,
        });
      }
    }
    res.status(400).send(error);
  }
});

router.post(
  "/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/me/avatar", auth, async (req, res) => {
  try {
    if (!req.user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/jpg");
    res.send(req.user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

router.delete("/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});



router.delete("/me", auth, async (req, res) => {
  try {
    await req.user.deleteOne();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
