const express = require('express');
const router = express.Router();
const {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    getLeaveById,
    updateLeaveStatus,
    deleteLeave,
} = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('employee', 'manager', 'admin'), applyLeave);
router.get('/my', protect, getMyLeaves);
router.get('/', protect, authorize('manager', 'admin'), getAllLeaves);
router.get('/:id', protect, getLeaveById);
router.put('/:id/status', protect, authorize('manager', 'admin'), updateLeaveStatus);
router.delete('/:id', protect, deleteLeave);

module.exports = router;
