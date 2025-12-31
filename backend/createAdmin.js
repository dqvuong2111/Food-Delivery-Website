import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "./models/userModel.js";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";

const createAdmin = async () => {
    await connectDB();

    const email = "admin@example.com";
    const password = "admin";
    const name = "Admin";

    const exists = await userModel.findOne({ email });
    if (exists) {
        console.log("User already exists. Updating role to admin...");
        exists.role = "admin";
        await exists.save();
        console.log("User promoted to admin successfully");
    } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const adminUser = new userModel({
            name,
            email,
            password: hashedPassword,
            role: "admin"
        });
        await adminUser.save();
        console.log("Admin user created successfully");
    }
    process.exit();
};

createAdmin();