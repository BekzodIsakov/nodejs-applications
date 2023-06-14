const express = require("express");
const router = express.Router();

const TaskModel = require("../models/Task");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const task = new TaskModel({
    ...req.body,
    author: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/", auth, async (req, res) => {
  const match = {};
  const sort = {};
  const { page, limit = 10 } = req.query;

  if (req.query.sort) {
    const parts = req.query.sort.split("_");
    sort[parts[0]] = parts[1];
  }

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  try {
    // const tasks = await TaskModel.find({ author: req.user._id });
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        skip: (page - 1) * limit,
        limit,
        sort,
      },
    });
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const task = await TaskModel.findOne({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!task) return res.status(404).send();

    // returns author object instead of user's id
    // await task.populate("author");

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "description", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    // const task = await TaskModel.findByIdAndUpdate(req.params.id, { new: true });
    const task = await TaskModel.findOne({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!task) return res.status(404).send();

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await TaskModel.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
