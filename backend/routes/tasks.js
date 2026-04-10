const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/tasks.json");

const readTasks = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

const saveTasks = (tasks) => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

router.get("/", (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

router.post("/", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Title is required"
    });
  }

  const tasks = readTasks();

  const newTask = {
    id: Date.now().toString(),
    title,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  saveTasks(tasks);

  res.status(201).json(newTask);
});

router.patch("/:id", (req, res) => {
  const tasks = readTasks();
  const task = tasks.find((t) => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  task.completed = !task.completed;
  saveTasks(tasks);

  res.json(task);
});

router.delete("/:id", (req, res) => {
  const tasks = readTasks();
  const filteredTasks = tasks.filter((t) => t.id !== req.params.id);

  saveTasks(filteredTasks);

  res.json({
    success: true,
    message: "Task deleted"
  });
});

module.exports = router;