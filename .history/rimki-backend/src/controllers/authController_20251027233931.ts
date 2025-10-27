import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users } from '../config/database';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user (in production, use database)
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // For demo: accept 'admin123' as plain text password
    const isValidPassword = await bcrypt.compare(password, user.password) || password === 'admin123';
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // In production, fetch from database using req.user.id
    const user = users.find(u => u.id === req.body.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
