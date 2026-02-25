const mongoose = require('mongoose');

const reimbursementSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [1, 'Amount must be positive'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        receipt: {
            type: String, // file path or URL
            default: '',
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        reviewedAt: {
            type: Date,
        },
        rejectionReason: {
            type: String,
            default: '',
        },
        reviewNote: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Reimbursement', reimbursementSchema);
