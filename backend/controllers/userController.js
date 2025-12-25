import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// login user
const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:"User does not exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.json({success:false, message:"Invalid credentials"});
        }

        const token = createToken(user._id);
        res.json({success:true, token, role: user.role});

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}

// register user
const registerUser = async (req, res) => {
    const {name, password, email} = req.body;
    try {
        // checking is user already exists
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false, message:"User already exists"});
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Please enter a valid email"});
        }

        if(password.length < 8){
            return res.json({success:false, message:"Please enter a strong password"});
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        await newUser.save();

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true, token})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Registering user failed"})
    }
}

// register admin (only accessible by existing admins)
const registerAdmin = async (req, res) => {
    const {name, password, email} = req.body;
    try {
        // checking is user already exists
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false, message:"User already exists"});
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Please enter a valid email"});
        }

        if(password.length < 8){
            return res.json({success:false, message:"Please enter a strong password"});
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new userModel({
            name: name,
            email: email,
            password: hashedPassword,
            role: "admin" // Explicitly set role to admin
        })

        await newAdmin.save();
        res.json({success:true, message: "Admin account created successfully"})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error creating admin"})
    }
}

// list all admins
const listAdmins = async (req, res) => {
    try {
        const admins = await userModel.find({role: "admin"}).select("-password");
        res.json({success: true, data: admins});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error fetching admins"});
    }
}

// remove admin
const removeAdmin = async (req, res) => {
    try {
        const adminId = req.body.id;
        const admin = await userModel.findById(adminId);
        
        if (!admin) {
            return res.json({success: false, message: "Admin not found"});
        }

        // Optional: Prevent deleting self (would need req.body.userId from auth middleware)
        // For now, we allow it, but frontend should handle visual feedback.

        await userModel.findByIdAndDelete(adminId);
        res.json({success: true, message: "Admin removed successfully"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error removing admin"});
    }
}

// get user profile
const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId);
        res.json({ success: true, userData: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address
        }});
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// update user profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address } = req.body;
        await userModel.findByIdAndUpdate(userId, { name, phone, address });
        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// add to wishlist
const addToWishlist = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let wishlist = await userData.wishlist;
        wishlist[req.body.itemId] = true;
        await userModel.findByIdAndUpdate(req.body.userId, { wishlist });
        res.json({ success: true, message: "Added to Wishlist" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// remove from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let wishlist = await userData.wishlist;
        if (wishlist[req.body.itemId]) {
            delete wishlist[req.body.itemId];
        }
        await userModel.findByIdAndUpdate(req.body.userId, { wishlist });
        res.json({ success: true, message: "Removed from Wishlist" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// get wishlist
const getWishlist = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let wishlist = await userData.wishlist;
        res.json({ success: true, wishlist });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `${resetUrl}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Reset link sent to your email" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const user = await userModel.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ success: false, message: "Invalid or expired token" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ success: true, message: "Password reset successful" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { loginUser, registerUser, registerAdmin, listAdmins, removeAdmin, getProfile, updateProfile, addToWishlist, removeFromWishlist, getWishlist, forgotPassword, resetPassword };