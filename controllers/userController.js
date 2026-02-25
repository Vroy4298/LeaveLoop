const User = require('../models/User');

// @desc    Get all users (Admin/Manager)
// @route   GET /api/users
// @access  Private/Admin/Manager
const getAllUsers = async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin/Manager
const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
};

// @desc    Create user (Admin)
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
    const { name, email, password, role, department, designation } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role, department, designation });
    res.status(201).json({ success: true, user });
};

// @desc    Update user role/details (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    const { name, role, department, designation } = req.body;

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { name, role, department, designation },
        { new: true, runValidators: true }
    );

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
};

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    await user.deleteOne();
    res.json({ success: true, message: 'User deleted successfully' });
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
