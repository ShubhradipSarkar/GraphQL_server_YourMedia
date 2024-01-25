const express = require('express');
 const router = express.Router();
 const {users} = require("../models/models")
 const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');

// User registration
 router.post('/register', async (req, res) => {
 try {
 const { username, password, email } = req.body;
 console.log(username, password, email);
 const hashedPassword = await bcrypt.hash(password, 10);
 const user = new users({ username, password: hashedPassword , email});
 await user.save();
 res.status(201).json({ message: 'User registered successfully' });
 } catch (error) {
 res.status(500).json({ error: 'Registration failed' });
 }
 });

// User login
 router.post('/login', async (req, res) => {
 try {
 const { email, password } = req.body;
 const user = await users.findOne({ email });
 if (!user) {
 return res.status(401).json({ error: 'Authentication failed' });
 }
 const passwordMatch = await bcrypt.compare(password, user.password);
 if (!passwordMatch) {
 return res.status(401).json({ error: 'Authentication failed' });
 }
 const token = jwt.sign({ userId: user._id }, 'pappi123', {
 expiresIn: '10h',
 });
 res.status(200).json({ token, username: user.username, userId: user._id });
 } catch (error) {
 res.status(500).json({ error: 'Login failed' });
 }
 });

module.exports = router;