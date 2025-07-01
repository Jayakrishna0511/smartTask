const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Task = require('../models/Task');

// ✅ Add Task
router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = new Task({
      title,
      description,
      user: req.user.userId
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Error creating task', error: err.message });
  }
});

// 📋 Get All Tasks of Logged-in User
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching tasks' });
  }
});

// ✏️ Update Task
router.put('/:id', auth, async (req, res) => {
  const { title, description, isCompleted } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, description, isCompleted },
      { new: true }
    );
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating task' });
  }
});

// ❌ Delete Task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting task' });
  }
});

module.exports = router;
