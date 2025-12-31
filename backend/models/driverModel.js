import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleType: { type: String, default: "Bike" }, // e.g., Bike, Scooter, Car
    vehicleNumber: { type: String, required: true },
    status: { type: String, default: "offline" }, // offline, available, busy
    currentOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "order", default: null },
    totalDeliveries: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }
}, { minimize: false, timestamps: true });

const driverModel = mongoose.models.driver || mongoose.model("driver", driverSchema);

export default driverModel;
