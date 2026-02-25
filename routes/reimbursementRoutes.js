const express = require('express');
const router = express.Router();
const {
    submitReimbursement,
    getMyReimbursements,
    getAllReimbursements,
    getReimbursementById,
    updateReimbursementStatus,
    deleteReimbursement,
} = require('../controllers/reimbursementController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('employee'), submitReimbursement);
router.get('/my', protect, getMyReimbursements);
router.get('/', protect, authorize('manager', 'admin'), getAllReimbursements);
router.get('/:id', protect, getReimbursementById);
router.put('/:id/status', protect, authorize('manager', 'admin'), updateReimbursementStatus);
router.delete('/:id', protect, deleteReimbursement);

module.exports = router;
