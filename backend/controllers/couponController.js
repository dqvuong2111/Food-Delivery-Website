import couponModel from "../models/couponModel.js";

// Add Coupon
const addCoupon = async (req, res) => {
    try {
        if (req.body.discountPercentage > 100) {
            return res.json({ success: false, message: "Discount cannot exceed 100%" });
        }
        if (req.body.discountPercentage < 0) {
            return res.json({ success: false, message: "Discount cannot be negative" });
        }
        const coupon = new couponModel({
            code: req.body.code.toUpperCase(),
            discountPercentage: req.body.discountPercentage
        });
        await coupon.save();
        res.json({ success: true, message: "Coupon Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// List Coupons
const listCoupons = async (req, res) => {
    try {
        const coupons = await couponModel.find({});
        res.json({ success: true, data: coupons });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Remove Coupon
const removeCoupon = async (req, res) => {
    try {
        await couponModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Coupon Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Validate Coupon (For Frontend)
const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await couponModel.findOne({ code: code.toUpperCase() });
        if (coupon && coupon.isActive) {
            res.json({ success: true, discountPercentage: coupon.discountPercentage, message: "Coupon Applied" });
        } else {
            res.json({ success: false, message: "Invalid Coupon" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { addCoupon, listCoupons, removeCoupon, validateCoupon };