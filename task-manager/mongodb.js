const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

let client;

async function connectWithMongo() {
  client = new MongoClient(connectionURL);
  await client.connect();

  const db = client.db(databaseName);

  // db.collection("user").insertOne({ name: "Yusuf", age: 29 });
}

connectWithMongo()
  .then(() => console.log("Connected correctly!"))
  .catch(() => {
    console.log("Something went wrong! Connection failed.");
  });

// setTimeout(() => {
//   insertNewTask({task: 'Make coffee', assignee: 'Yusuf Isakov'})
// }, 5000);

async function insertNewTask(task) {
  await client.connect();

  const db = client.db(databaseName);
  db.collection('tasks').insertOne(task).then((res) => {
    console.log(res);
  })
}
 
async function getTask(task={}) {
  const db = client.db(databaseName);
  const res = await db.collection('tasks').find();
  for await (const doc of res) { 
    console.log(doc)
  }
}

setTimeout(() => {
  () => {
    const db = client.db(databaseName);
    db.collection('tasks').updateMany({completed: false}, {$set: {
      completed: true
    }}).then(res => {
      console.log(res.matchedCount);
    })
  }
}, 2000);

 