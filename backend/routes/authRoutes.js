const express = require('express');
const argon2 = require('argon2');
const User = require('../models/User'); 

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password, re_password } = req.body;

  // Check if passwords match
  if (password !== re_password) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash the password
    const passwordHash = await argon2.hash(password);

    // Create and save the new user
    const newUser = new User({
      username,
      email,
      passwordHash // Note: We directly use the hashed password here
    });

    await newUser.save();


    res.status(201).json({ message: 'User successfully registered.' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user.', error: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare provided password with stored hash
    const isMatch = await argon2.verify(user.passwordHash, password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Initiate a session for the logged-in user
    req.session.userId = user._id;
    userid=user._id;
    

    res.json({ message: 'Login successful.' });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during the login process.', error: error.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if(err) {
      return res.status(500).json({ message: 'Could not log out, please try again.' });
    }
    res.clearCookie('connect.sid'); // Adjust this to your session cookie name
    return res.status(200).json({ message: 'Logout successful.' });
  });
});

router.get('/session-check', (req, res) => {
  if (req.session.userId) {
    res.status(200).json({ message: "User is authenticated", isAuthenticated: true });
  } else {
    res.status(401).json({ message: "User is not authenticated", isAuthenticated: false });
  }
});
module.exports = router;
