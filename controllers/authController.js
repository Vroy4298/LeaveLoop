const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    console.log('Registration attempt received:', req.body);
    const { name, email, password, role, department, designation } = req.body;

    try {
        console.log('Checking if user exists with email:', email);
        const userExists = await User.findOne({ email });
        console.log('userExists check result:', userExists);

        if (userExists) {
            console.log('STOP: User already exists for email:', email);
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        console.log('Attempting to create user...');
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'employee',
            department,
            designation,
        });
        console.log('User created successfully. ID:', user._id);

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                designation: user.designation,
                profilePhoto: user.profilePhoto,
            },
        });
    } catch (error) {
        console.error('SERVER REGISTRATION ERROR:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Explicitly select password since it's excluded by default
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                designation: user.designation,
                profilePhoto: user.profilePhoto,
            },
        });
    } catch (error) {
        console.error('LOGIN ERROR:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error during login',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
    }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    const { name, department, designation, profilePhoto } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, department, designation, profilePhoto },
        { new: true, runValidators: true }
    );

    res.json({ success: true, user });
};

module.exports = { register, login, getMe, updateProfile };
