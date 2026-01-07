import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await orderModel.countDocuments({});
        const totalUsers = await userModel.countDocuments({});
        const totalFoodItems = await foodModel.countDocuments({});

        const orders = await orderModel.find({});
        const totalRevenue = orders.reduce((acc, order) => {
            return acc + (order.payment ? order.amount : 0);
        }, 0);

        // Find top selling items
        let itemSales = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                if (itemSales[item.name]) {
                    itemSales[item.name] += item.quantity;
                } else {
                    itemSales[item.name] = item.quantity;
                }
            });
        });

        const topItems = Object.entries(itemSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));


        res.json({
            success: true,
            data: {
                totalOrders,
                totalUsers,
                totalFoodItems,
                totalRevenue,
                topItems
            }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { getDashboardStats };
