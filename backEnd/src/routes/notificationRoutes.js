const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// Get all notifications for the logged-in user
router.get('/', protect, notificationController.getNotifications);

// Mark notification as read/unread
router.patch('/:id', protect, notificationController.markAsRead);

module.exports = router;
