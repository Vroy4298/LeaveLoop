const Leave = require('../models/Leave');

// @desc    Apply for leave (Employee)
// @route   POST /api/leaves
// @access  Private/Employee
const applyLeave = async (req, res) => {
    const { leaveType, fromDate, toDate, reason } = req.body;

    const leave = await Leave.create({
        user: req.user._id,
        leaveType,
        fromDate,
        toDate,
        reason,
    });

    res.status(201).json({ success: true, leave });
};

// @desc    Get my leaves (Employee)
// @route   GET /api/leaves/my
// @access  Private/Employee
const getMyLeaves = async (req, res) => {
    const leaves = await Leave.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, leaves });
};

// @desc    Get all leaves (Manager/Admin)
// @route   GET /api/leaves
// @access  Private/Manager/Admin
const getAllLeaves = async (req, res) => {
    const leaves = await Leave.find()
        .populate('user', 'name email department designation profilePhoto')
        .populate('reviewedBy', 'name')
        .sort({ createdAt: -1 });
    res.json({ success: true, leaves });
};

// @desc    Get single leave
// @route   GET /api/leaves/:id
// @access  Private
const getLeaveById = async (req, res) => {
    const leave = await Leave.findById(req.params.id)
        .populate('user', 'name email department designation')
        .populate('reviewedBy', 'name');

    if (!leave) {
        return res.status(404).json({ success: false, message: 'Leave not found' });
    }
    res.json({ success: true, leave });
};

// @desc    Update leave status (Manager/Admin)
// @route   PUT /api/leaves/:id/status
// @access  Private/Manager/Admin
const updateLeaveStatus = async (req, res) => {
    const { status, reviewNote, rejectionReason } = req.body;

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
        return res.status(404).json({ success: false, message: 'Leave not found' });
    }

    leave.status = status;
    leave.reviewedBy = req.user._id;
    leave.reviewNote = reviewNote || '';
    if (status === 'Rejected') {
        leave.rejectionReason = rejectionReason || '';
    }

    await leave.save();

    res.json({ success: true, leave });
};

// @desc    Delete leave (Employee - only if pending)
// @route   DELETE /api/leaves/:id
// @access  Private
const deleteLeave = async (req, res) => {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
        return res.status(404).json({ success: false, message: 'Leave not found' });
    }

    // Only the owner can delete & only if pending
    if (leave.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (leave.status !== 'Pending') {
        return res.status(400).json({ success: false, message: 'Cannot delete a reviewed leave' });
    }

    await leave.deleteOne();
    res.json({ success: true, message: 'Leave deleted' });
};

module.exports = {
    applyLeave,
    getMyLeaves,
    getAllLeaves,
    getLeaveById,
    updateLeaveStatus,
    deleteLeave,
};
