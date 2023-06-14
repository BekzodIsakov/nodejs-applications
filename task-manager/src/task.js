require("./mongoose");
const Task = require("./models/Task");

// Task.findByIdAndDelete("646db640980c8bf37bf24dfc")
//   .then(() => {
//     return Task.countDocuments({ task: "Make coffee" });
//   })
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));

async function deleteTaskAndCount(id) {
  try {
    await Task.findByIdAndDelete(id);
    const res = await Task.countDocuments({ task: "Make coffee" });
    console.log(res);
  } catch (e) {
    console.log(e);
  }
}

deleteTaskAndCount("646dbe7eaaea49644620dc41");
