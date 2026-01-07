import mongoose from "mongoose";
import orderModel from "./models/orderModel.js";
import "dotenv/config";
import { connectDB } from "./config/db.js";

const checkStatus = async () => {
    await connectDB();
    const orders = await orderModel.find({});
    const statuses = new Set();
    orders.forEach(order => {
        statuses.add(`'${order.status}'`);
    });
    console.log("Distinct Statuses:", Array.from(statuses));
    mongoose.disconnect();
};

checkStatus();
