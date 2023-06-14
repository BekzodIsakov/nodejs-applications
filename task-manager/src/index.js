const express = require("express");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

require("./mongoose.js");

const app = express();

app.use(express.json());
app.use("/users", userRouter);
app.use("/tasks", taskRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is live on port " + port);
});
