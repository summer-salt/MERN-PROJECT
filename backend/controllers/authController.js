// backend/controllers/authController.js
const userModel = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'please_set_a_strong_jwt_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '1d';

const registerController = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body || {};

    // basic validation (optional: replace with express-validator)
    if (!name || !email || !phone || !password) {
      return res.status(400).send({
        success: false,
        message: 'Name, email, phone and password are required',
      });
    }

    // normalize email
    const normalizedEmail = String(email).toLowerCase().trim();

    // check existing user
    const existingUser = await userModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      // optional harmless hint (last 6 chars of id)
      const hint = existingUser._id ? String(existingUser._id).slice(-6) : undefined;

      return res.status(409).send({
        success: false,
        message: 'Email already registered. Please login or use Forgot Password.',
        hint: hint ? `Account ID ends with ...${hint}` : undefined,
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user document (avoid passing arbitrary req.body)
    const newUser = new userModel({
      name: name.trim(),
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      role: role || 'user', // keep default role if provided
    });

    await newUser.save();

    // return safe response (do NOT return password)
    const safeUser = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
    };

    return res.status(201).send({
      success: true,
      message: 'User registered successfully',
      user: safeUser,
    });
  } catch (error) {
    console.error('registerController error:', error);

    // handle duplicate-key race condition
    if (error.code === 11000 && error.keyValue && error.keyValue.email) {
      return res.status(409).send({
        success: false,
        message: 'Email already registered. Please login or reset your password.'
      });
    }

    return res.status(500).send({
      success: false,
      message: 'Error in Register API',
      error: error.message || error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password, role } = req.body || {};
    if (!email || !password) {
      return res.status(400).send({ success: false, message: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).send({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // optional role check: if provided in request, compare; otherwise skip
    if (role && user.role !== role) {
      return res.status(403).send({
        success: false,
        message: 'Role does not match',
      });
    }

    // compare password
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(401).send({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // create JWT (do NOT include password in token payload)
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });

    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    return res.status(200).send({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('loginController error:', error);
    return res.status(500).send({
      success: false,
      message: 'Error in Login API',
      error: error.message || error,
    });
  }
};

const currentUserController = async (req, res) => {
  try {
    // Prefer req.user (set by auth middleware). Fallback to body for backwards compat.
    const userId = (req.user && req.user.userId) || (req.user && req.user.id) || req.body.userId || req.body.user?.id;

    if (!userId) {
      return res.status(401).send({
        success: false,
        message: 'Unauthorized: no user id found',
      });
    }

    // exclude password field
    const user = await userModel.findById(userId).select('-password');
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).send({
      success: true,
      message: 'User fetched successfully',
      user,
    });
  } catch (error) {
    console.error('currentUserController error:', error);
    return res.status(500).send({
      success: false,
      message: 'Error in getting current user',
      error: error.message || error,
    });
  }
};

module.exports = { registerController, loginController, currentUserController };
