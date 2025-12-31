import driverModel from "../models/driverModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Create Token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Login Driver
const loginDriver = async (req, res) => {
    const { email, password } = req.body;
    try {
        const driver = await driverModel.findOne({ email });
        if (!driver) {
            return res.json({ success: false, message: "Driver does not exist" });
        }

        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(driver._id);
        res.json({ success: true, token, driverId: driver._id });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Register Driver
const registerDriver = async (req, res) => {
    const { name, email, password, phone, vehicleNumber, vehicleType } = req.body;
    try {
        // Check if driver already exists
        const exists = await driverModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Driver already exists" });
        }

        // Validate email & password strength
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newDriver = new driverModel({
            name,
            email,
            password: hashedPassword,
            phone,
            vehicleNumber,
            vehicleType
        });

        const driver = await newDriver.save();
        const token = createToken(driver._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error registering driver" });
    }
};

// Get Driver Profile
const getDriverProfile = async (req, res) => {
    try {
        // req.body.driverId should be set by auth middleware
        const driver = await driverModel.findById(req.body.userId); // Reusing userId from auth middleware if it decodes 'id'
        if (!driver) {
             return res.json({ success: false, message: "Driver not found" });
        }
        res.json({ success: true, driverData: driver });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Update Driver Status (Available/Offline)
const updateDriverStatus = async (req, res) => {
    try {
        const { userId, status } = req.body; 
        await driverModel.findByIdAndUpdate(userId, { status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { loginDriver, registerDriver, getDriverProfile, updateDriverStatus };
