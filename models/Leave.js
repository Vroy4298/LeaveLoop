const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        leaveType: {
            type: String,
            enum: ['Annual', 'Sick', 'Casual', 'Maternity', 'Paternity', 'Unpaid'],
            required: [true, 'Leave type is required'],
        },
        fromDate: {
            type: Date,
            required: [true, 'From date is required'],
        },
        toDate: {
            type: Date,
            required: [true, 'To date is required'],
        },
        reason: {
            type: String,
            required: [true, 'Reason is required'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        reviewedAt: {
            type: Date,
            default: null,
        },
        rejectionReason: {
            type: String,
            default: '',
        },
        reviewNote: {
            type: String,
            default: '',
        },
        // AI-generated summary cache — populated by /api/ai/summarize/:id
        aiSummary: {
            text:        { type: String, default: '' },
            urgency:     { type: String, enum: ['High', 'Medium', 'Low', ''], default: '' },
            score:       { type: Number, default: 0 },
            generatedAt: { type: Date,   default: null },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Leave', leaveSchema);
