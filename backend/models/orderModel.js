import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	items: { type: Array, required: true },
	amount: { type: Number, required: true },
	deliveryFee: { type: Number, default: 0 },
	address: { type: Object, required: true },
	status: { type: String, default: "Pending" },
	cancellationReason: { type: String, default: "" },
	date: { type: Date, default: Date.now },
	payment: { type: Boolean, default: false },
	deliveryId: { type: String, default: "" },
	deliveryStatus: { type: String, default: "" },
	isRead: { type: Boolean, default: false }
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
