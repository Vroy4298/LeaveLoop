const express = require('express');
const router = express.Router();
const { getMyNotifications, markAllAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMyNotifications);
router.put('/read', protect, markAllAsRead);

module.exports = router;
