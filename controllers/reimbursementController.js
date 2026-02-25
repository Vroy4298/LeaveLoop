const Reimbursement = require('../models/Reimbursement');

// @desc    Submit reimbursement (Employee)
// @route   POST /api/reimbursements
// @access  Private/Employee
const submitReimbursement = async (req, res) => {
    const { title, amount, description } = req.body;

    const reimbursement = await Reimbursement.create({
        user: req.user._id,
        title,
        amount,
        description,
        receipt: req.file ? req.file.path : '',
    });

    res.status(201).json({ success: true, reimbursement });
};

// @desc    Get my reimbursements (Employee)
// @route   GET /api/reimbursements/my
// @access  Private/Employee
const getMyReimbursements = async (req, res) => {
    const reimbursements = await Reimbursement.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, reimbursements });
};

// @desc    Get all reimbursements (Manager/Admin)
// @route   GET /api/reimbursements
// @access  Private/Manager/Admin
const getAllReimbursements = async (req, res) => {
    const reimbursements = await Reimbursement.find()
        .populate('user', 'name email department designation profilePhoto')
        .populate('reviewedBy', 'name')
        .sort({ createdAt: -1 });
    res.json({ success: true, reimbursements });
};

// @desc    Get single reimbursement
// @route   GET /api/reimbursements/:id
// @access  Private
const getReimbursementById = async (req, res) => {
    const reimbursement = await Reimbursement.findById(req.params.id)
        .populate('user', 'name email department designation')
        .populate('reviewedBy', 'name');

    if (!reimbursement) {
        return res.status(404).json({ success: false, message: 'Reimbursement not found' });
    }
    res.json({ success: true, reimbursement });
};

// @desc    Update reimbursement status (Manager/Admin)
// @route   PUT /api/reimbursements/:id/status
// @access  Private/Manager/Admin
const updateReimbursementStatus = async (req, res) => {
    const { status, reviewNote, rejectionReason } = req.body;

    const reimbursement = await Reimbursement.findById(req.params.id);
    if (!reimbursement) {
        return res.status(404).json({ success: false, message: 'Reimbursement not found' });
    }

    reimbursement.status = status;
    reimbursement.reviewedBy = req.user._id;
    reimbursement.reviewNote = reviewNote || '';
    if (status === 'Rejected') {
        reimbursement.rejectionReason = rejectionReason || '';
    }
    await reimbursement.save();

    res.json({ success: true, reimbursement });
};

// @desc    Delete reimbursement (Employee - only if pending)
// @route   DELETE /api/reimbursements/:id
// @access  Private
const deleteReimbursement = async (req, res) => {
    const reimbursement = await Reimbursement.findById(req.params.id);
    if (!reimbursement) {
        return res.status(404).json({ success: false, message: 'Reimbursement not found' });
    }

    if (reimbursement.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (reimbursement.status !== 'Pending') {
        return res.status(400).json({ success: false, message: 'Cannot delete a reviewed reimbursement' });
    }

    await reimbursement.deleteOne();
    res.json({ success: true, message: 'Reimbursement deleted' });
};

module.exports = {
    submitReimbursement,
    getMyReimbursements,
    getAllReimbursements,
    getReimbursementById,
    updateReimbursementStatus,
    deleteReimbursement,
};
