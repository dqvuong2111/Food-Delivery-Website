import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      deliveryFee: req.body.deliveryFee, // Save delivery fee to order history
      address: req.body.address,
    });
    await newOrder.save();
    // Do not clear cart here. Wait for payment success.
    // await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "vnd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 25000,
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: "vnd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: req.body.deliveryFee, // Use actual fee from frontend
      },
      quantity: 1,
    });

    // Construct return URLs
    // Priority: 1. Explicit params from frontend, 2. Origin header, 3. Env var, 4. Localhost default
    let successUrl, cancelUrl;
    const orderId = newOrder._id.toString();

    if (req.body.success_url && req.body.cancel_url) {
      successUrl = `${req.body.success_url}${orderId}`;
      cancelUrl = `${req.body.cancel_url}${orderId}`;
    } else {
      // Fallback: Use the origin of the request (most robust for local dev with varying ports)
      const origin = req.headers.origin || req.body.origin || process.env.FRONTEND_URL || "http://localhost:5175";
      successUrl = `${origin}/verify?success=true&orderId=${orderId}`;
      cancelUrl = `${origin}/verify?success=false&orderId=${orderId}`;
    }

    console.log(`[Stripe Redirect] Success: ${successUrl}, Cancel: ${cancelUrl}`);

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      const order = await orderModel.findByIdAndUpdate(orderId, { payment: true });
      // Clear cart only after successful payment
      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId, payment: true }).sort({ date: -1 })
    res.json({ success: true, data: orders })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }
}

//Listing orders for admin panel
const listOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, data: orders })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }
}

// api for updating order status 
const updateStatus = async (req, res) => {
  try {
    const { orderId, status, cancellationReason } = req.body;
    let updateData = { status };
    if (cancellationReason) {
      updateData.cancellationReason = cancellationReason;
    }
    await orderModel.findByIdAndUpdate(orderId, updateData);
    res.json({ success: true, message: "Status updated" })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" })
  }
}

// Mark order as read
const markAsRead = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { isRead: true });
    res.json({ success: true, message: "Marked as read" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}

export { placeOrder, verifyOrder, userOrders, listOrder, updateStatus, markAsRead };