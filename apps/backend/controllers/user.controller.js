import {User} from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;
        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if(password.length < 6|| password.length > 60) {
            return res.status(400).json({ message: 'Password must be between 6 and 60 characters' });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim().toLowerCase();
        const existingUser = await User.findOne({ $or: [ { email: normalizedEmail }, { username: normalizedUsername } ] });
        if(existingUser) {
            return res.status(409).json({ message: 'Username or email already in use' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword
        });
        if (newUser){
            const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
                expiresIn:"7d",
            });
            res.cookie("token",token,{
                httpOnly:true,
                secure:process.env.NODE_ENV==="production",
                sameSite: "strict",
            });
        }
        await newUser.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
async function loginUser(req, res) {
    try {
        const { username, password } = req.body;

        if(!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const user=await User.findOne({ username: username.trim().toLowerCase() });
        if(!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function logoutUser(req, res) {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: 'Lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function updateUser(req, res) {
    try {
        const {newUsername, newEmail} = req.body;
        if (!newUsername && !newEmail) {
            return res.status(400).json({ message: 'At least one field (username or email) is required to update' });
        }
        const updates = {};
        if (newUsername) {
            updates.username = newUsername.trim().toLowerCase();
        }
        if (newEmail) {
            const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/ ;
            if (!emailRegex.test(newEmail)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }
            updates.email = newEmail.trim().toLowerCase();
        }
        if (updates.username||updates.email) {  
            const existingUser = await User.findOne({ _id:{$ne:req.user._id}, $or: [ updates.email?{ email: updates.email }:null, updates.username?{ username: updates.username }:null] });
            if (existingUser) {
                return res.status(409).json({ message: 'Username or email already in use' });
            }
        }
        const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true});
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user._id).select('username email role');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error loading current user:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}



export { registerUser, loginUser, logoutUser, updateUser, getCurrentUser };
