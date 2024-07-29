const User = require("../model/userModel");
const Product = require("../model/productModel");
const Cart = require("../model/cartModel");
const Order = require("../model/orderModel");
const Coupon = require("../model/couponModel");
const Wallet= require("../model/walletModel");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid'); // Ensure you have uuid installed
const Razorypay = require("razorpay");
const PDFDocument = require("pdfkit-table");

const orderManagement = {

placeOrder: async (req, res) => {
    try {
      const userId = req.session.user.id;
      const cart = await Cart.findOne({ userId }).populate("product.productId");
  
      if (!cart || !cart.product.length) {
        return res.status(400).json({ success: false, message: "Cart is empty" });
      }
  
      const orderId = uuidv4();
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Calculate billTotal
      let billTotal = 0;
      for (const item of cart.product) {
        billTotal += item.productId.price * item.quantity;
      }
  
      const { addressIndex, paymentMethod } = req.body;
      const selectedAddress = user.address[addressIndex];
  
      if (paymentMethod !== "Cash On Delivery") {
        return res.status(400).json({ success: false, message: "Invalid payment method" });
      }
  
      const newOrder = new Order({
        orderId,
        user: userId,
        items: cart.product.map((item) => ({
          productId: item.productId._id,
          title: item.productId.name,
          name: item.productId.name,
          image: item.productId.image,
          productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
          quantity: item.quantity,
          price: item.productId.discountPrice > 0 ? item.productId.discountPrice * item.quantity : item.productId.price * item.quantity,
        })),
        billTotal: billTotal,
        shippingAddress: {
          houseName: selectedAddress.houseName,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          country: selectedAddress.country,
          postalCode: selectedAddress.postalCode,
        },
        paymentMethod,
      });
  
      // Save order to the database
      await newOrder.save();
  
      // Update product stock
      for (const item of newOrder.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product with id ${item.productId} not found`);
        }
  
        // Ensure stock is a valid number
        if (isNaN(product.stock)) {
          product.stock = 0;
        }
        product.stock -= item.quantity;
  
        // Validate that stock is not negative
        if (product.stock < 0) {
          product.stock = 0; // Handle as needed
        }
  
        await product.save();
      }
  
      // Clear user's cart after successful order placement
      await Cart.findOneAndDelete({ userId });
  
      res.status(201).json({ success: true, message: "Order placed successfully" });
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },
  

  // Cancel Order
  cancelOrder: async (req, res) => {
    try {
      const { orderId, itemId, cancellationReason } = req.body;
      // Find the order by orderId
      const order = await Order.findById(orderId);
      const userId = req.session.user.id;
      // If order is not found
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Find the item within the order by itemId
      const item = order.items.find((item) => item._id.toString() === itemId);

      // If item is not found
      if (!item) {
        return res.status(404).json({ message: "Item not found in the order" });
      }

      // Update the status of the item to 'Cancelled'
      item.status = "Cancelled";
      item.cancellationReason = cancellationReason;

      // Decrease the item price from the billTotal
      const refundAmount = item.productPrice * item.quantity;
      order.billTotal -= refundAmount;

      // Check if all items in the order are cancelled
      const allItemsCancelled = order.items.every(
        (item) => item.status === "Cancelled"
      );

      // If all items are cancelled, update the order status to 'Cancelled'
      if (allItemsCancelled) {
        order.orderStatus = "Cancelled";
      }

      // Save the updated order
      await order.save();

      // Update the product stock
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      product.stock += item.quantity;
      await product.save();

      res.status(200).json({ message: "Order item cancelled successfully", order });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "An error occurred while cancelling the order item" });
    }
  },

  // Load Order View
  loadOrderView: async (req, res) => {
    try {
      const userId = req.session.user.id;
      const user = await User.findById(userId);
      const { id } = req.query;
      const order = await Order.findById(id);
      const cart = await Cart.findOne({ userId });
      let cartCount = 0;
      if (cart) {
        cartCount = cart.product.length;
      }
      res.render("viewOrder", { user, order, cartCount });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

loadOrder: async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const perPage = 10;
      const totalOrderCount = await Order.countDocuments({});
      const totalPages = Math.ceil(totalOrderCount / perPage);
      const skip = (page - 1) * perPage;

      const orders = await Order.find({}).populate('user').skip(skip).limit(perPage).sort({ orderDate: -1 });
      res.render("order", { orders, currentPage: page, totalPages });
  } catch (error) {
      console.log(error.message);
  }
},


changeOrderStatus: async (req, res) => {
  
    try {
      const { orderId, orderStatus } = req.body;
     console.log(orderStatus);
      // Find the order by orderId
      const order = await Order.findById(orderId);

      // If order is not found
      if (!order) {
          return res.status(404).json({ message: 'Order not found' });
      }

      // Update the order status
      order.orderStatus = orderStatus;

    
      if (orderStatus === "Shipped") {
          order.items.forEach(item => {
              item.status = "Shipped";
          });
      }

      if (orderStatus === "Delivered") {
          order.items.forEach(item => {
              item.status = "Delivered";
          });
          if(order.paymentMethod==="Cash On Delivery"){
              order.paymentStatus="Success"
          }

      }

      // Save the updated order
      await order.save();

      res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while updating order status' });
  }
},



loadOrderDetails: async (req, res) => {
  try {
      const orderId = req.query.id;
      const order = await Order.findById(orderId);
      res.render("orderDetails", { order });
  } catch (error) {
      console.log(error.message);
  }
}

}



module.exports = orderManagement;
