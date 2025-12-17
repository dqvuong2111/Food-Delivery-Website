import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";

const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await orderModel.countDocuments({});
        const totalFoodItems = await foodModel.countDocuments({});
        const totalUsers = await userModel.countDocuments({});
        
        const orders = await orderModel.find({});
        const totalRevenue = orders.reduce((acc, curr) => acc + curr.amount, 0);

        // Simple recent orders
        const recentOrders = await orderModel.find({}).sort({date: -1}).limit(5);

        res.json({
            success: true,
            data: {
                totalOrders,
                totalFoodItems,
                totalUsers,
                totalRevenue,
                recentOrders
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { getDashboardStats };