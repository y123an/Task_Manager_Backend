const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
app.use(bodyParser.json());
app.use(cors());

const connect = async () => {
  await mongoose
    .connect(
      "mongodb+srv://Ebishu:Yoniab23@cluster0.vx1dviu.mongodb.net/dailyTasks?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("connected to db");
    });
};

connect();

const TaskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    require: true,
  },
});

const tasks = [
  "Do 3 leetcode problems",
  "Do 2 CodeForces problems",
  "Class study of 1 Hour",
  "Kuraz 2 Hours",
  "Final Project 1 Hours",
  "Machine Learning 1 Hour",
];
const Task = mongoose.model("Task", TaskSchema);

// for (let i = 0; i < tasks.length; i++) {
//   Task.create({
//     task: tasks[i],
//     status: false,
//   });
// }

app.get("/", async (req, res) => {
  const task = await Task.find({});

  try {
    res.json({ tasks: task });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/reset", async (req, res) => {
  try {
    const result = await Task.updateMany({}, { status: false });
    if (!result) {
      res.status(404).send({ error: "task is not find !" });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
  const task = await Task.find({});
  res.json({ tasks: task });
});
app.post("/", async (req, res) => {
  try {
    const filter = { _id: req.body.id };
    const update = { status: true };

    const result = await Task.findOneAndUpdate(filter, update);
    if (!result) {
      res.status(404).send({ error: "task is not find !" });
    }
  } catch (err) {
    res.status(500).send({ error: err });
  }
  const task = await Task.find({});
  res.json({ tasks: task });
});

app.listen(5000, () => console.log("listening at port 5000"));
