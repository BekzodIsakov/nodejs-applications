const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/task-manager", {
    useNewUrlParser: true,
  })
  .then((res) => {
    console.log("Connection sucess!");
  })
  .catch((err) => {
    console.log("Connection failure!");
    console.log(err);
  });
