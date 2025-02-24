import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
    },
    status: {
      type: String,
      default: "Order Placed",
      enum: [
        "Order Placed",
        "Order Accepted",
        "Order Dispatched",
        "Order Delivered",
        "Order Cancelled",
      ],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
