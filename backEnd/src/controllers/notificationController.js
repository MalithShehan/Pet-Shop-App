const Notification = require('../models/Notification');

// Get notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Mark notification as read/unread
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { isRead },
      { new: true }
    );
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

// Create a notification (for system use)
exports.createNotification = async (userId, type, message, link = '') => {
  try {
    const notification = new Notification({ user: userId, type, message, link });
    await notification.save();
    return notification;
  } catch (err) {
    // Log error
  }
};
