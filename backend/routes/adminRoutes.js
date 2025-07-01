const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Task = require('../models/Task');

// ✅ Admin Dashboard - Get all users with task stats
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, 'name email isActive role'); // Exclude password

    const stats = await Promise.all(
      users.map(async (user) => {
        const completed = await Task.countDocuments({ user: user._id, isCompleted: true });
        const pending = await Task.countDocuments({ user: user._id, isCompleted: false });

        return {
          ...user._doc,
          completedTasks: completed,
          pendingTasks: pending
        };
      })
    );

    res.json(stats);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch users and stats', error: err.message });
  }
});

// 🔁 Toggle (Activate / Deactivate) User
router.put('/user/:id/toggle', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      msg: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: user.isActive
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error toggling user status', error: err.message });
  }
});

module.exports = router;
