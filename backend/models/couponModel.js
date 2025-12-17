import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountPercentage: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
})

const couponModel = mongoose.models.coupon || mongoose.model("coupon", couponSchema);

export default couponModel;