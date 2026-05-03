const express = require('express');
const router = express.Router();
const { summarizeLeave, summarizeAllPending } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Both routes require a logged-in manager or admin
router.get('/summarize/:id', protect, authorize('manager', 'admin'), summarizeLeave);
router.get('/summary-all', protect, authorize('manager', 'admin'), summarizeAllPending);

module.exports = router;
