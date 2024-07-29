const User = require("../model/userModel");
const Product = require("../model/productModel");
const Cart = require("../model/cartModel");
const Order = require("../model/orderModel");
const Coupon = require("../model/couponModel");
const Wallet= require("../model/walletModel");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid'); // Ensure you have uuid installed
const Razorpay = require("razorpay");
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();


const PDFDocument = require("pdfkit-table");
// const verifyPaymentSignature  = require("../controllers/razorpayUtils");
const { verifyPaymentSignature } = require('./razorpayUtils');


// const { verifyPaymentSignature } = require('./razorpayUtils'); // Adjust the path as necessary

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const orderManagement = {

// placeOrder: async (req, res) => {
//     try {
//       const userId = req.session.user.id;
//       const cart = await Cart.findOne({ userId }).populate("product.productId");
  
//       if (!cart || !cart.product.length) {
//         return res.status(400).json({ success: false, message: "Cart is empty" });
//       }
  
//       const orderId = uuidv4();
//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ success: false, message: "User not found" });
//       }
  
//       // Calculate billTotal
//       let billTotal = 0;
//       for (const item of cart.product) {
//         billTotal += item.productId.price * item.quantity;
//       }
  
//       const { addressIndex, paymentMethod } = req.body;
//       const selectedAddress = user.address[addressIndex];
  
//       if (paymentMethod !== "Cash On Delivery") {
//         return res.status(400).json({ success: false, message: "Invalid payment method" });
//       }
  
//       const newOrder = new Order({
//         orderId,
//         user: userId,
//         items: cart.product.map((item) => ({
//           productId: item.productId._id,
//           name: item.productId.name,
//           name: item.productId.name,
//           image: item.productId.image,
//           productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
//           quantity: item.quantity,
//           price: item.productId.discountPrice > 0 ? item.productId.discountPrice * item.quantity : item.productId.price * item.quantity,
//         })),
//         billTotal: billTotal,
//         shippingAddress: {
//           houseName: selectedAddress.houseName,
//           street: selectedAddress.street,
//           city: selectedAddress.city,
//           state: selectedAddress.state,
//           country: selectedAddress.country,
//           postalCode: selectedAddress.postalCode,
//         },
//         paymentMethod,
//       });
  
//       // Save order to the database
//       await newOrder.save();
  
//       // Update product stock
//       for (const item of newOrder.items) {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with id ${item.productId} not found`);
//         }
  
//         // Ensure stock is a valid number
//         if (isNaN(product.stock)) {
//           product.stock = 0;
//         }
//         product.stock -= item.quantity;
  
//         // Validate that stock is not negative
//         if (product.stock < 0) {
//           product.stock = 0; // Handle as needed
//         }
  
//         await product.save();
//       }
  
//       // Clear user's cart after successful order placement
//       await Cart.findOneAndDelete({ userId });
  
//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } catch (error) {
//       console.error("Error placing order:", error);
//       res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
//   },
  

  // Cancel Order

  // placeOrder: async (req, res) => {
  //   try {
  //     const userId = req.session.user.id;
  //     const cart = await Cart.findOne({ userId }).populate("product.productId");
  
  //     if (!cart || !cart.product.length) {
  //       return res.status(400).json({ success: false, message: "Cart is empty" });
  //     }
  
  //     const orderId = uuidv4();
  //     const user = await User.findById(userId);
  //     if (!user) {
  //       return res.status(404).json({ success: false, message: "User not found" });
  //     }
  
  //     const { addressIndex, paymentMethod, totalAmount, couponId, subtotal } = req.body;
  //     const selectedAddress = user.address[addressIndex];
  
  //     if (paymentMethod === "razorpay") {
  //       const options = {
  //         amount: Math.round(parseFloat(totalAmount) * 100), // Razorpay expects amount in cents
  //         currency: "USD",
  //         receipt: `receipt_${orderId}`,
  //       };
  
  //       razorpayInstance.orders.create(options, (err, order) => {
  //         if (err) {
  //           console.error("Razorpay error:", err);
  //           return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
  //         }
  
  //         res.status(200).json({
  //           success: true,
  //           message: "Order Created",
  //           order_id: order.id,
  //           amount: Math.round(totalAmount * 100),
  //           key_id: process.env.RAZOR_PAY_KEY,
  //           product_name: "Order Items",
  //           description: "Purchase from our store",
  //           contact: user.phone || "",
  //           name: user.name,
  //           email: user.email,
  //         });
  //       });
  //     } else if (paymentMethod === "Cash On Delivery") {
  //       let couponAmount = 0;
  //       let couponCode = "";
  //       if (couponId) {
  //         const coupon = await Coupon.findById(couponId);
  //         if (coupon) {
  //           couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
  //           couponCode = coupon.couponcode;
  //         }
  //       }
  
  //       const newOrder = new Order({
  //         orderId,
  //         user: userId,
  //         items: cart.product.map((item) => ({
  //           productId: item.productId._id,
  //           name: item.productId.name,
  //           image: item.productId.image,
  //           productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
  //           quantity: item.quantity,
  //           price: item.productId.discountPrice > 0 ? item.productId.discountPrice * item.quantity : item.productId.price * item.quantity,
  //         })),
  //         billTotal: couponId ? parseFloat(totalAmount) : parseFloat(subtotal),
  //         shippingAddress: {
  //           houseName: selectedAddress.houseName,
  //           street: selectedAddress.street,
  //           city: selectedAddress.city,
  //           state: selectedAddress.state,
  //           country: selectedAddress.country,
  //           postalCode: selectedAddress.postalCode,
  //         },
  //         paymentMethod,
  //         couponAmount,
  //         couponCode,
  //         couponId,
  //       });
  
  //       await newOrder.save();
  
  //       // Update product stock
  //       for (const item of newOrder.items) {
  //         await Product.findByIdAndUpdate(item.productId, {
  //           $inc: { stock: -item.quantity }
  //         });
  //       }
  
  //       await Cart.findOneAndDelete({ userId });
  
  //       res.status(201).json({ success: true, message: "Order placed successfully" });
  //     } else {
  //       res.status(400).json({ success: false, message: "Invalid payment method" });
  //     }
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //     res.status(500).json({ success: false, message: "Internal Server Error" });
  //   }
  // },




  // onlinePlaceOrder: async (req, res) => {
  //   try {
  //     const userId = req.session.user.id;
  //     const cart = await Cart.findOne({ userId }).populate("product.productId");

  //     if (!cart || !cart.product.length) {
  //       return res.status(400).json({ success: false, message: "Cart is empty" });
  //     }
  //     const orderId = uuidv4();

  //     const user = await User.findById(userId);
  //     if (!user) {
  //       return res.status(404).json({ success: false, message: "User not found" });
  //     }

  //     const { addressIndex, status, totalAmount, paymentMethod } = req.query;
  //     const { couponId, subtotal } = req.body;
  //     const selectedAddress = user.address[addressIndex];

  //     let couponAmount = 0;
  //     let couponCode = 0;
  //     if (couponId) {
  //       const coupon = await Coupon.findById(couponId);
  //       couponAmount = (parseInt(subtotal) * coupon.discountamount) / 100;
  //       couponCode = coupon.couponcode;
  //     }

  //     const newOrder = new Order({
  //       orderId,
  //       user: userId,
  //       items: cart.product.map((item) => ({
  //         productId: item.productId._id,
  //         name: item.productId.name,
  //         image: item.productId.image,
  //         productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
  //         quantity: item.quantity,
  //         price: item.productId.discountPrice > 0 ? item.productId.discountPrice * item.quantity : item.productId.price * item.quantity,
  //         status: status === "Success" ? "Confirmed" : "Pending",
  //       })),
  //       billTotal: couponId ? parseInt(totalAmount) : parseInt(subtotal),
  //       shippingAddress: {
  //         houseName: selectedAddress.houseName,
  //         street: selectedAddress.street,
  //         city: selectedAddress.city,
  //         state: selectedAddress.state,
  //         country: selectedAddress.country,
  //         postalCode: selectedAddress.postalCode,
  //       },
  //       paymentMethod,
  //       paymentStatus: status,
  //       couponAmount,
  //       couponCode,
  //       couponId,
  //     });

  //     await newOrder.save();
  //     if (newOrder.paymentStatus == "Success") {
  //       for (const item of newOrder.items) {
  //         const product = await Product.findById(item.productId);
  //         if (!product) {
  //           throw new Error(`Product with id ${item.productId} not found`);
  //         }
  //         product.stock -= item.quantity;
  //         await product.save();
  //       }

  //       await Cart.findOneAndDelete({ userId });

  //       res.status(201).json({ success: true, message: "Order placed successfully" });
  //     } else if (newOrder.paymentStatus === "Failed") {
  //       await Cart.findOneAndDelete({ userId });
  //       res.status(201).json({ success: true, message: "Payment failed retry" });
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //     res.status(500).json({ success: false, message: "Internal Server Error" });
  //   }
  // },











  // cancelOrder: async (req, res) => {
  //   try {
  //     const { orderId, itemId, cancellationReason } = req.body;
  //     // Find the order by orderId
  //     const order = await Order.findById(orderId);
  //     const userId = req.session.user.id;
  //     // If order is not found
  //     if (!order) {
  //       return res.status(404).json({ message: "Order not found" });
  //     }

  //     // Find the item within the order by itemId
  //     const item = order.items.find((item) => item._id.toString() === itemId);

  //     // If item is not found
  //     if (!item) {
  //       return res.status(404).json({ message: "Item not found in the order" });
  //     }

  //     // Update the status of the item to 'Cancelled'
  //     item.status = "Cancelled";
  //     item.cancellationReason = cancellationReason;

  //     // Decrease the item price from the billTotal
  //     const refundAmount = item.productPrice * item.quantity;
  //     order.billTotal -= refundAmount;

  //     // Check if all items in the order are cancelled
  //     const allItemsCancelled = order.items.every(
  //       (item) => item.status === "Cancelled"
  //     );

  //     // If all items are cancelled, update the order status to 'Cancelled'
  //     if (allItemsCancelled) {
  //       order.orderStatus = "Cancelled";
  //     }

  //     // Save the updated order
  //     await order.save();

  //     // Update the product stock
  //     const product = await Product.findById(item.productId);
  //     if (!product) {
  //       throw new Error(`Product with id ${item.productId} not found`);
  //     }
  //     product.stock += item.quantity;
  //     await product.save();

  //     res.status(200).json({ message: "Order item cancelled successfully", order });
  //   } catch (error) {
  //     console.error("Error:", error);
  //     res.status(500).json({ message: "An error occurred while cancelling the order item" });
  //   }
  // },

  // Load Order View
 


//  last
//  placeOrder : async (req, res) => {
//     try {
//         const userId = req.session.user.id;
//         const cart = await Cart.findOne({ userId }).populate("product.productId");

//         if (!cart || !cart.product.length) {
//             return res.status(400).json({ success: false, message: "Cart is empty" });
//         }

//         const orderId = uuidv4();
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         const { addressIndex, paymentMethod, totalAmount, couponId, subtotal } = req.body;
//         const { status } = req.query;
//         const selectedAddress = user.address[addressIndex];

//         let couponAmount = 0;
//         let couponCode = "";
//         if (couponId) {
//             const coupon = await Coupon.findById(couponId);
//             if (coupon) {
//                 couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//                 couponCode = coupon.couponcode;
//             }
//         }

//         const newOrder = new Order({
//             orderId,
//             user: userId,
//             items: cart.product.map((item) => ({
//                 productId: item.productId._id,
//                 name: item.productId.name,
//                 image: item.productId.image,
//                 productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
//                 quantity: item.quantity,
//                 price: item.productId.discountPrice > 0 ? item.productId.discountPrice * item.quantity : item.productId.price * item.quantity,
//                 status: paymentMethod === "razorpay" && status === "Success" ? "Confirmed" : "Pending",
//             })),
//             billTotal: couponId ? parseFloat(totalAmount) : parseFloat(subtotal),
//             shippingAddress: {
//                 houseName: selectedAddress.houseName,
//                 street: selectedAddress.street,
//                 city: selectedAddress.city,
//                 state: selectedAddress.state,
//                 country: selectedAddress.country,
//                 postalCode: selectedAddress.postalCode,
//             },
//             paymentMethod,
//             paymentStatus: status || "Pending",
//             couponAmount,
//             couponCode,
//             couponId,
//         });

//         if (paymentMethod === "razorpay") {
//             const options = {
//                 amount: Math.round(parseFloat(totalAmount) * 100), // Razorpay expects amount in cents
//                 currency: "USD",
//                 receipt: `receipt_${orderId}`,
//             };

//             razorpayInstance.orders.create(options, async (err, order) => {
//                 if (err) {
//                     console.error("Razorpay error:", err);
//                     return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
//                 }

//                 await newOrder.save();
//                 res.status(200).json({
//                     success: true,
//                     message: "Order Created",
//                     order_id: order.id,
//                     amount: Math.round(totalAmount * 100),
//                     key_id: process.env.RAZOR_PAY_KEY,
//                     product_name: "Order Items",
//                     description: "Purchase from our store",
//                     contact: user.phone || "",
//                     name: user.name,
//                     email: user.email,
//                 });
//             });
//         } else if (paymentMethod === "Cash On Delivery") {
//             await newOrder.save();

//             // Update product stock for COD
//             for (const item of newOrder.items) {
//                 await Product.findByIdAndUpdate(item.productId, {
//                     $inc: { stock: -item.quantity }
//                 });
//             }

//             await Cart.findOneAndDelete({ userId });

//             res.status(201).json({ success: true, message: "Order placed successfully" });
//         } else {
//             res.status(400).json({ success: false, message: "Invalid payment method" });
//         }

//         if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Success") {
//             for (const item of newOrder.items) {
//                 const product = await Product.findById(item.productId);
//                 if (!product) {
//                     throw new Error(`Product with id ${item.productId} not found`);
//                 }
//                 product.stock -= item.quantity;
//                 await product.save();
//             }

//             await Cart.findOneAndDelete({ userId });
//         } else if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Failed") {
//             await Cart.findOneAndDelete({ userId });
//             res.status(201).json({ success: true, message: "Payment failed, retry" });
//         }
//     } catch (error) {
//         console.error("Error placing order:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// },


// new sub
// placeOrder : async (req, res) => {
//   try {
//     const userId = req.session.user.id;
//     const cart = await Cart.findOne({ userId }).populate("product.productId");

//     if (!cart || !cart.product.length) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const orderId = uuidv4();
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const { addressIndex, paymentMethod, totalAmount, couponId, subtotal } = req.body;
//     const { status } = req.query;

//     if (!subtotal || isNaN(subtotal)) {
//       return res.status(400).json({ success: false, message: "Invalid subtotal" });
//     }

//     const selectedAddress = user.address[addressIndex];
//     if (!selectedAddress) {
//       return res.status(400).json({ success: false, message: "Invalid address" });
//     }

//     let couponAmount = 0;
//     let couponCode = "";
//     if (couponId) {
//       const coupon = await Coupon.findById(couponId);
//       if (coupon) {
//         couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//         couponCode = coupon.couponcode;
//       }
//     }

//     const items = cart.product.map((item) => {
//       if (!item.productId.name) {
//         throw new Error('Product name is missing');
//       }
//       const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//       return {
//         productId: item.productId._id,
//         name: item.productId.name,
//         image: item.productId.image,
//         productPrice: price,
//         quantity: item.quantity,
//         price: price * item.quantity,
//         status: paymentMethod === "razorpay" && status === "Success" ? "Confirmed" : "Pending",
//       };
//     });

//     const billTotal = couponId ? parseFloat(totalAmount) : parseFloat(subtotal);
//     if (isNaN(billTotal)) {
//       return res.status(400).json({ success: false, message: "Invalid total amount" });
//     }

//     const newOrder = new Order({
//       orderId,
//       user: userId,
//       items,
//       billTotal,
//       shippingAddress: {
//         houseName: selectedAddress.houseName,
//         street: selectedAddress.street,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         country: selectedAddress.country,
//         postalCode: selectedAddress.postalCode,
//       },
//       paymentMethod,
//       paymentStatus: status || "Pending",
//       couponAmount,
//       couponCode,
//       couponId,
//     });

//     if (paymentMethod === "razorpay") {
//       const options = {
//         amount: Math.round(parseFloat(totalAmount) * 100), // Razorpay expects amount in paise
//         currency: "INR",
//         receipt: `receipt_${orderId}`,
//       };

//       razorpayInstance.orders.create(options, async (err, order) => {
//         if (err) {
//           console.error("Razorpay error:", err);
//           return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
//         }

//         await newOrder.save();
//         res.status(200).json({
//           success: true,
//           message: "Order Created",
//           order_id: order.id,
//           amount: Math.round(totalAmount * 100),
//           key_id: process.env.RAZOR_PAY_KEY,
//           product_name: "Order Items",
//           description: "Purchase from our store",
//           contact: user.phone || "",
//           name: user.name,
//           email: user.email,
//         });
//       });
//     } else if (paymentMethod === "Cash On Delivery") {
//       await newOrder.save();

//       // Update product stock for COD
//       for (const item of newOrder.items) {
//         await Product.findByIdAndUpdate(item.productId, {
//           $inc: { stock: -item.quantity }
//         });
//       }

//       await Cart.findOneAndDelete({ userId });

//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } else {
//       res.status(400).json({ success: false, message: "Invalid payment method" });
//     }

//     if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Success") {
//       for (const item of newOrder.items) {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with id ${item.productId} not found`);
//         }
//         product.stock -= item.quantity;
//         await product.save();
//       }

//       await Cart.findOneAndDelete({ userId });
//     } else if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Failed") {
//       await Cart.findOneAndDelete({ userId });
//       res.status(201).json({ success: true, message: "Payment failed, retry" });
//     }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },


// debug
// placeOrder : async (req, res) => {
//   try {
//     const userId = req.session.user.id;
//     const cart = await Cart.findOne({ userId }).populate("product.productId");

//     if (!cart || !cart.product.length) {
//       console.log("Cart is empty for user:", userId);
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const orderId = uuidv4();
//     const user = await User.findById(userId);
//     if (!user) {
//       console.log("User not found for ID:", userId);
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const { addressIndex, paymentMethod, totalAmount, couponId, subtotal } = req.body;
//     const { status } = req.query;

//     // Debugging: Log the received values
//     console.log("Received values:", { addressIndex, paymentMethod, totalAmount, couponId, subtotal });

//     // Validate subtotal
//     if (!subtotal || isNaN(parseFloat(subtotal))) {
//       console.log("Invalid subtotal:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid subtotal" });
//     }

//     const selectedAddress = user.address[addressIndex];
//     if (!selectedAddress) {
//       console.log("Invalid address index:", addressIndex);
//       return res.status(400).json({ success: false, message: "Invalid address" });
//     }

//     let couponAmount = 0;
//     let couponCode = "";
//     if (couponId) {
//       const coupon = await Coupon.findById(couponId);
//       if (coupon) {
//         couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//         couponCode = coupon.couponcode;
//       }
//     }

//     const items = cart.product.map((item) => {
//       if (!item.productId.name) {
//         throw new Error('Product name is missing');
//       }
//       const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//       return {
//         productId: item.productId._id,
//         name: item.productId.name,
//         image: item.productId.image,
//         productPrice: price,
//         quantity: item.quantity,
//         price: price * item.quantity,
//         status: paymentMethod === "razorpay" && status === "Success" ? "Confirmed" : "Pending",
//       };
//     });

//     const billTotal = couponId ? parseFloat(totalAmount) : parseFloat(subtotal);
//     if (isNaN(billTotal)) {
//       console.log("Invalid total amount:", totalAmount, "or subtotal:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid total amount" });
//     }

//     const newOrder = new Order({
//       orderId,
//       user: userId,
//       items,
//       billTotal,
//       shippingAddress: {
//         houseName: selectedAddress.houseName,
//         street: selectedAddress.street,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         country: selectedAddress.country,
//         postalCode: selectedAddress.postalCode,
//       },
//       paymentMethod,
//       paymentStatus: status || "Pending",
//       couponAmount,
//       couponCode,
//       couponId,
//     });

//     if (paymentMethod === "razorpay") {
//       const options = {
//         amount: Math.round(parseFloat(totalAmount) * 100), // Razorpay expects amount in paise
//         currency: "INR",
//         receipt: `receipt_${orderId}`,
//       };

//       razorpayInstance.orders.create(options, async (err, order) => {
//         if (err) {
//           console.error("Razorpay error:", err);
//           return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
//         }

//         await newOrder.save();
//         res.status(200).json({
//           success: true,
//           message: "Order Created",
//           order_id: order.id,
//           amount: Math.round(totalAmount * 100),
//           key_id: process.env.RAZOR_PAY_KEY,
//           product_name: "Order Items",
//           description: "Purchase from our store",
//           contact: user.phone || "",
//           name: user.name,
//           email: user.email,
//         });
//       });
//     } else if (paymentMethod === "Cash On Delivery") {
//       await newOrder.save();

//       // Update product stock for COD
//       for (const item of newOrder.items) {
//         await Product.findByIdAndUpdate(item.productId, {
//           $inc: { stock: -item.quantity }
//         });
//       }

//       await Cart.findOneAndDelete({ userId });

//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } else {
//       res.status(400).json({ success: false, message: "Invalid payment method" });
//     }

//     if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Success") {
//       for (const item of newOrder.items) {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with id ${item.productId} not found`);
//         }
//         product.stock -= item.quantity;
//         await product.save();
//       }

//       await Cart.findOneAndDelete({ userId });
//     } else if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Failed") {
//       await Cart.findOneAndDelete({ userId });
//       res.status(201).json({ success: true, message: "Payment failed, retry" });
//     }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },

// new
// placeOrder : async (req, res) => {
//   try {
//     const userId = req.session.user.id;
//     const cart = await Cart.findOne({ userId }).populate("product.productId");

//     if (!cart || !cart.product.length) {
//       console.log("Cart is empty for user:", userId);
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const orderId = uuidv4();
//     const user = await User.findById(userId);
//     if (!user) {
//       console.log("User not found for ID:", userId);
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const { addressIndex, paymentMethod, totalAmount, couponcode } = req.body;
//     let { subtotal } = req.body;
//     const { status } = req.query;

//     // Debugging: Log the received values
//     console.log("Received values:", { addressIndex, paymentMethod, totalAmount, couponcode, subtotal });

//     // Validate subtotal and calculate it if it's undefined
//     if (!subtotal || isNaN(parseFloat(subtotal))) {
//       subtotal = cart.product.reduce((acc, item) => {
//         const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//         return acc + price * item.quantity;
//       }, 0);
//       console.log("Calculated subtotal:", subtotal);
//     }

//     // Check if the calculated subtotal is valid
//     if (!subtotal || isNaN(parseFloat(subtotal))) {
//       console.log("Invalid subtotal after calculation:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid subtotal" });
//     }

//     const selectedAddress = user.address[addressIndex];
//     if (!selectedAddress) {
//       console.log("Invalid address index:", addressIndex);
//       return res.status(400).json({ success: false, message: "Invalid address" });
//     }

//     let couponAmount = 0;
//     let coupon = null;
//     if (couponcode) {
//       coupon = await Coupon.findOne({ couponcode });
//       if (coupon) {
//         couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//       }
//     }

//     const items = cart.product.map((item) => {
//       if (!item.productId.name) {
//         throw new Error('Product name is missing');
//       }
//       const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//       return {
//         productId: item.productId._id,
//         name: item.productId.name,
//         image: item.productId.image,
//         productPrice: price,
//         quantity: item.quantity,
//         price: price * item.quantity,
//         status: paymentMethod === "razorpay" && status === "Success" ? "Confirmed" : "Pending",
//       };
//     });

//     const billTotal = coupon ? parseFloat(totalAmount) : parseFloat(subtotal);
//     if (isNaN(billTotal)) {
//       console.log("Invalid total amount:", totalAmount, "or subtotal:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid total amount" });
//     }

//     const newOrder = new Order({
//       orderId,
//       user: userId,
//       items,
//       billTotal,
//       shippingAddress: {
//         houseName: selectedAddress.houseName,
//         street: selectedAddress.street,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         country: selectedAddress.country,
//         postalCode: selectedAddress.postalCode,
//       },
//       paymentMethod,
//       paymentStatus: status || "Pending",
//       couponAmount,
//       couponCode: coupon ? coupon.couponcode : "",
//       couponId: coupon ? coupon._id : null,
//     });

//     if (paymentMethod === "razorpay") {
//       const options = {
//         amount: Math.round(parseFloat(totalAmount) * 100), // Razorpay expects amount in paise
//         currency: "INR",
//         receipt: `receipt_${orderId}`,
//       };

//       razorpayInstance.orders.create(options, async (err, order) => {
//         if (err) {
//           console.error("Razorpay error:", err);
//           return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
//         }

//         await newOrder.save();
//         res.status(200).json({
//           success: true,
//           message: "Order Created",
//           order_id: order.id,
//           amount: Math.round(totalAmount * 100),
//           key_id: process.env.RAZOR_PAY_KEY,
//           product_name: "Order Items",
//           description: "Purchase from our store",
//           contact: user.phone || "",
//           name: user.name,
//           email: user.email,
//         });
//       });
//     } else if (paymentMethod === "Cash On Delivery") {
//       await newOrder.save();

//       // Update product stock for COD
//       for (const item of newOrder.items) {
//         await Product.findByIdAndUpdate(item.productId, {
//           $inc: { stock: -item.quantity }
//         });
//       }

//       await Cart.findOneAndDelete({ userId });

//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } else {
//       res.status(400).json({ success: false, message: "Invalid payment method" });
//     }

//     if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Success") {
//       for (const item of newOrder.items) {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with id ${item.productId} not found`);
//         }
//         product.stock -= item.quantity;
//         await product.save();
//       }

//       await Cart.findOneAndDelete({ userId });
//     } else if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Failed") {
//       await Cart.findOneAndDelete({ userId });
//       res.status(201).json({ success: true, message: "Payment failed, retry" });
//     }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },

// new 2 test worked not opening
// placeOrder: async (req, res) => {
//   console.log("placeOrder function called");
//   try {
//     const userId = req.session.user.id;
//     console.log("User ID:", userId);

//     const cart = await Cart.findOne({ userId }).populate("product.productId");
//     if (!cart || !cart.product.length) {
//       console.log("Cart is empty for user:", userId);
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const orderId = uuidv4();
//     const user = await User.findById(userId);
//     if (!user) {
//       console.log("User not found for ID:", userId);
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const { addressIndex, paymentMethod, totalAmount, couponcode } = req.body;
//     let { subtotal } = req.body;
//     const { status } = req.query;

//     console.log("Received values:", { addressIndex, paymentMethod, totalAmount, couponcode, subtotal });

//     // Validate subtotal and calculate it if it's undefined
//     if (!subtotal || isNaN(parseFloat(subtotal))) {
//       subtotal = cart.product.reduce((acc, item) => {
//         const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//         return acc + price * item.quantity;
//       }, 0);
//       console.log("Calculated subtotal:", subtotal);
//     }

//     // Check if the calculated subtotal is valid
//     if (!subtotal || isNaN(parseFloat(subtotal))) {
//       console.log("Invalid subtotal after calculation:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid subtotal" });
//     }

//     const selectedAddress = user.address[addressIndex];
//     if (!selectedAddress) {
//       console.log("Invalid address index:", addressIndex);
//       return res.status(400).json({ success: false, message: "Invalid address" });
//     }

//     let couponAmount = 0;
//     let coupon = null;
//     if (couponcode) {
//       coupon = await Coupon.findOne({ couponcode });
//       if (coupon) {
//         couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//         console.log("Coupon applied:", couponcode, "Discount amount:", couponAmount);
//       } else {
//         console.log("Invalid coupon code:", couponcode);
//       }
//     }

//     const items = cart.product.map((item) => {
//       if (!item.productId.name) {
//         throw new Error('Product name is missing');
//       }
//       const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//       return {
//         productId: item.productId._id,
//         name: item.productId.name,
//         image: item.productId.image,
//         productPrice: price,
//         quantity: item.quantity,
//         price: price * item.quantity,
//         status: paymentMethod === "razorpay" && status === "Success" ? "Confirmed" : "Pending",
//       };
//     });

//     const billTotal = coupon ? parseFloat(totalAmount) : parseFloat(subtotal);
//     if (isNaN(billTotal)) {
//       console.log("Invalid total amount:", totalAmount, "or subtotal:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid total amount" });
//     }

//     const newOrder = new Order({
//       orderId,
//       user: userId,
//       items,
//       billTotal,
//       shippingAddress: {
//         houseName: selectedAddress.houseName,
//         street: selectedAddress.street,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         country: selectedAddress.country,
//         postalCode: selectedAddress.postalCode,
//       },
//       paymentMethod,
//       paymentStatus: status || "Pending",
//       couponAmount,
//       couponCode: coupon ? coupon.couponcode : "",
//       couponId: coupon ? coupon._id : null,
//     });

//     console.log("New order created:", newOrder);

//     if (paymentMethod === "razorpay") {
//       const receipt = `receipt_${orderId}`.substring(0, 40);
//       const options = {
//         amount: Math.round(parseFloat(totalAmount) * 100), // Razorpay expects amount in paise
//         currency: "INR",
//         receipt: receipt,
//       };

//       razorpayInstance.orders.create(options, async (err, order) => {
//         if (err) {
//           console.error("Razorpay error:", err);
//           return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
//         }

//         newOrder.razorpayOrderId = order.id;
//         await newOrder.save();
//         console.log("Razorpay order created:", order.id);
//         res.status(200).json({
//           success: true,
//           message: "Order Created",
//           order_id: order.id,
//           amount: Math.round(totalAmount * 100),
//           key_id: process.env.RAZOR_PAY_KEY,
//           product_name: "Order Items",
//           description: "Purchase from our store",
//           contact: user.phone || "",
//           name: user.name,
//           email: user.email,
//         });
//       });
//     } else if (paymentMethod === "Cash On Delivery") {
//       await newOrder.save();
//       console.log("Order placed with Cash On Delivery");

//       // Update product stock for COD
//       for (const item of newOrder.items) {
//         await Product.findByIdAndUpdate(item.productId, {
//           $inc: { stock: -item.quantity }
//         });
//       }

//       await Cart.findOneAndDelete({ userId });
//       console.log("Cart cleared for user:", userId);

//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } else {
//       res.status(400).json({ success: false, message: "Invalid payment method" });
//     }

//     if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Success") {
//       for (const item of newOrder.items) {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with id ${item.productId} not found`);
//         }
//         product.stock -= item.quantity;
//         await product.save();
//         console.log("Product stock updated:", product._id);
//       }

//       await Cart.findOneAndDelete({ userId });
//       console.log("Cart cleared for user:", userId);
//     } else if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Failed") {
//       await Cart.findOneAndDelete({ userId });
//       res.status(201).json({ success: true, message: "Payment failed, retry" });
//     }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },

// test 3 

placeOrder: async (req, res) => {
  console.log("placeOrder function called");
  try {
    const userId = req.session.user.id;
    console.log("User ID:", userId);

    const cart = await Cart.findOne({ userId }).populate("product.productId");
    if (!cart || !cart.product.length) {
      console.log("Cart is empty for user:", userId);
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const orderId = uuidv4();
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for ID:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { addressIndex, paymentMethod, totalAmount, couponcode } = req.body;
    let { subtotal } = req.body;
    const { status } = req.query;

    console.log("Received values:", { addressIndex, paymentMethod, totalAmount, couponcode, subtotal });

    // Validate subtotal and calculate it if it's undefined
    if (!subtotal || isNaN(parseFloat(subtotal))) {
      subtotal = cart.product.reduce((acc, item) => {
        const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
        return acc + price * item.quantity;
      }, 0);
      console.log("Calculated subtotal:", subtotal);
    }

    // Check if the calculated subtotal is valid
    if (!subtotal || isNaN(parseFloat(subtotal))) {
      console.log("Invalid subtotal after calculation:", subtotal);
      return res.status(400).json({ success: false, message: "Invalid subtotal" });
    }

    const selectedAddress = user.address[addressIndex];
    if (!selectedAddress) {
      console.log("Invalid address index:", addressIndex);
      return res.status(400).json({ success: false, message: "Invalid address" });
    }

    let couponAmount = 0;
    let coupon = null;
    if (couponcode) {
      coupon = await Coupon.findOne({ couponcode });
      if (coupon) {
        couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
        console.log("Coupon applied:", couponcode, "Discount amount:", couponAmount);
      } else {
        console.log("Invalid coupon code:", couponcode);
      }
    }

    const items = cart.product.map((item) => {
      if (!item.productId.name) {
        throw new Error('Product name is missing');
      }
      const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
      return {
        productId: item.productId._id,
        name: item.productId.name,
        image: item.productId.image,
        productPrice: price,
        quantity: item.quantity,
        price: price * item.quantity,
        status: paymentMethod === "razorpay" && status === "Success" ? "Confirmed" : "Pending",
      };
    });

    const billTotal = coupon ? parseFloat(totalAmount) : parseFloat(subtotal);
    if (isNaN(billTotal)) {
      console.log("Invalid total amount:", totalAmount, "or subtotal:", subtotal);
      return res.status(400).json({ success: false, message: "Invalid total amount" });
    }

    const newOrder = new Order({
      orderId,
      user: userId,
      items,
      billTotal,
      shippingAddress: {
        houseName: selectedAddress.houseName,
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        country: selectedAddress.country,
        postalCode: selectedAddress.postalCode,
      },
      paymentMethod,
      paymentStatus: status || "Pending",
      couponAmount,
      couponCode: coupon ? coupon.couponcode : "",
      couponId: coupon ? coupon._id : null,
    });

    console.log("New order created:", newOrder);

    if (paymentMethod === "razorpay") {
      const receipt = `receipt_${orderId}`.substring(0, 40);
      const options = {
        amount: Math.round(parseFloat(totalAmount) * 100), // Razorpay expects amount in paise
        currency: "INR",
        receipt: receipt,
      };

      razorpayInstance.orders.create(options, async (err, order) => {
        if (err) {
          console.error("Razorpay error:", err);
          return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
        }

        newOrder.razorpayOrderId = order.id;
        await newOrder.save();
        console.log("Razorpay order created:", order.id);
        res.status(200).json({
          success: true,
          message: "Order Created",
          order_id: order.id,
          amount: Math.round(totalAmount * 100),
          key_id: process.env.RAZOR_PAY_KEY,
          product_name: "Order Items",
          description: "Purchase from our store",
          contact: user.phone || "",
          name: user.name,
          email: user.email,
        });
      });
    } else if (paymentMethod === "Cash On Delivery") {
      await newOrder.save();
      console.log("Order placed with Cash On Delivery");

      // Update product stock for COD
      for (const item of newOrder.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
      }

      await Cart.findOneAndDelete({ userId });
      console.log("Cart cleared for user:", userId);

      res.status(201).json({ success: true, message: "Order placed successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid payment method" });
    }

    if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Success") {
      for (const item of newOrder.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product with id ${item.productId} not found`);
        }
        product.stock -= item.quantity;
        await product.save();
        console.log("Product stock updated:", product._id); 
      }

      await Cart.findOneAndDelete({ userId });
      console.log("Cart cleared for user:", userId);
    } else if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Failed") {
      await Cart.findOneAndDelete({ userId });
      res.status(201).json({ success: true, message: "Payment failed, retry" });
    }
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
},

  






// last
// onlineOrderPlacing : async (req, res) => {
//   const { addressIndex, status, totalAmount, paymentMethod } = req.query;
//   const { couponId, subtotal, razorpay_payment_id } = req.body;
  
//   const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

//   // Create a payment response object
//   const paymentResponse = {
//       order_id: razorpay_payment_id,
//       payment_id: razorpay_payment_id,
//       signature: razorpay_signature
//   };

//   // Verify payment signature
//   if (!verifyPaymentSignature(paymentResponse, razorpaySecret)) {
//       return res.status(400).json({ success: false, message: 'Invalid payment signature' });
//   }





//   try {
//       // Find the order based on the Razorpay payment ID or another unique identifier
//       const order = await Order.findOne({ razorpay_order_id: razorpay_payment_id });

//       if (!order) {
//           return res.status(404).json({ success: false, message: 'Order not found' });
//       }

//       // Update order based on payment status
//       if (status === 'Success') {
//           order.paymentStatus = 'Paid';
//           order.orderStatus = 'Confirmed';
//           // Update other order details as necessary
//       } else if (status === 'Failed') {
//           order.paymentStatus = 'Failed';
//           order.orderStatus = 'Payment Failed';
//           // Update other order details as necessary
//       }

//       // Save the updated order
//       await order.save();

//       // Respond to the client
//       res.json({ success: true, message: 'Order placed successfully' });
//   } catch (error) {
//       console.error('Error processing payment response:', error);
//       res.status(500).json({ success: false, message: 'Error processing payment response' });
//   }
// },

// new erking 
// onlineOrderPlacing : async (req, res) => {
//   const { addressIndex, status, totalAmount, paymentMethod } = req.query;
//   const { couponId, subtotal, razorpay_payment_id, razorpay_signature } = req.body;

//   console.log('Received query parameters:', { addressIndex, status, totalAmount, paymentMethod });
//   console.log('Received body parameters:', { couponId, subtotal, razorpay_payment_id, razorpay_signature });

//   const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
//   console.log('Razorpay Secret:', razorpaySecret);

//   // Create a payment response object
//   const paymentResponse = {
//       order_id: razorpay_payment_id,
//       payment_id: razorpay_payment_id,
//       signature: razorpay_signature
//   };

//   // Verify payment signature
//   const isSignatureValid = verifyPaymentSignature(paymentResponse, razorpaySecret);
//   console.log('Signature Valid:', isSignatureValid);

//   if (!isSignatureValid) {
//       console.log('Invalid payment signature');
//       return res.status(400).json({ success: false, message: 'Invalid payment signature' });
//   }

//   try {
//       // Find the order based on the Razorpay payment ID or another unique identifier
//       const order = await Order.findOne({ razorpay_order_id: razorpay_payment_id });

//       if (!order) {
//           console.log('Order not found');
//           return res.status(404).json({ success: false, message: 'Order not found' });
//       }

//       // Update order based on payment status
//       if (status === 'Success') {
//           order.paymentStatus = 'Paid';
//           order.orderStatus = 'Confirmed';
//           console.log('Order status updated to Confirmed');
//       } else if (status === 'Failed') {
//           order.paymentStatus = 'Failed';
//           order.orderStatus = 'Payment Failed';
//           console.log('Order status updated to Payment Failed');
//       }

//       // Save the updated order
//       await order.save();
//       console.log('Order saved successfully');

//       // Respond to the client
//       res.json({ success: true, message: 'Order placed successfully' });
//   } catch (error) {
//       console.error('Error processing payment response:', error);
//       res.status(500).json({ success: false, message: 'Error processing payment response' });
//   }
// },

// new nw
// onlineOrderPlacing : async (req, res) => {
//   // Log the entire request body to inspect incoming data
//   console.log('Received request body:', req.body);
  
//   const { addressIndex, status, totalAmount, paymentMethod } = req.query;
//   const { couponId, subtotal, razorpay_payment_id, razorpay_signature } = req.body;

//   const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

//   // Create a payment response object
//   const paymentResponse = {
//     order_id: razorpay_payment_id,
//     payment_id: razorpay_payment_id,
//     signature: razorpay_signature
//   };

//   // Log the payment response and Razorpay secret
//   console.log('Payment response:', paymentResponse);
//   console.log('Razorpay secret:', razorpaySecret);

//   // Verify payment signature
//   const isSignatureValid = verifyPaymentSignature(paymentResponse, razorpaySecret);
//   console.log('Is signature valid:', isSignatureValid);

//   if (!isSignatureValid) {
//     return res.status(400).json({ success: false, message: 'Invalid payment signature' });
//   }

//   try {
//     // Find the order based on the Razorpay payment ID or another unique identifier
//     const order = await Order.findOne({ razorpay_order_id: razorpay_payment_id });

//     // Log the order found in the database
//     console.log('Found order:', order);

//     if (!order) {
//       return res.status(404).json({ success: false, message: 'Order not found' });
//     }

//     // Update order based on payment status
//     if (status === 'Success') {
//       order.paymentStatus = 'Paid';
//       order.orderStatus = 'Confirmed';
//     } else if (status === 'Failed') {
//       order.paymentStatus = 'Failed';
//       order.orderStatus = 'Payment Failed';
//     }

//     // Save the updated order
//     await order.save();

//     // Respond to the client
//     res.json({ success: true, message: 'Order placed successfully' });
//   } catch (error) {
//     console.error('Error processing payment response:', error);
//     res.status(500).json({ success: false, message: 'Error processing payment response' });
//   }
// },

// noo nweee
// onlineOrderPlacing :   async (req, res) => {
//   console.log('Received request body:', req.body);

//   const { order_id, payment_id, signature, status } = req.body;
//   const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

//   const paymentResponse = {
//       order_id,
//       payment_id,
//       signature
//   };

//   console.log('Payment response:', paymentResponse);
//   console.log('Razorpay secret:', razorpaySecret);

//   const isSignatureValid = verifyPaymentSignature(paymentResponse, razorpaySecret);
//   console.log('Is signature valid:', isSignatureValid);

//   if (!isSignatureValid) {
//       return res.status(400).json({ success: false, message: 'Invalid payment signature' });
//   }

//   try {
//       const order = await Order.findOne({ razorpay_order_id: order_id });
//       console.log('Found order:', order);

//       if (!order) {
//           return res.status(404).json({ success: false, message: 'Order not found' });
//       }

//       if (status === 'Success') {
//           order.paymentStatus = 'Paid';
//           order.orderStatus = 'Confirmed';
//       } else if (status === 'Failed') {
//           order.paymentStatus = 'Failed';
//           order.orderStatus = 'Payment Failed';
//       }

//       await order.save();
//       res.json({ success: true, message: 'Order placed successfully' });
//   } catch (error) {
//       console.error('Error processing payment response:', error);
//       res.status(500).json({ success: false, message: 'Error processing payment response' });
//   }
// },


// onlineOrderPlacing : async (req, res) => {
//   try {
//     const userId = req.session.user.id;

//     const cart = await Cart.findOne({ userId }).populate("product.productId");

//     if (!cart || !cart.product.length) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }
//     const orderId = uuidv4();

//     const user = await User.findById(userId);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     const { addressIndex, status, totalAmount, paymentMethod } = req.query;

//     const { couponId, subtotal } = req.body;

//     const selectedAddress = user.address[addressIndex];

//     let couponAmount = 0;
//     let couponCode = 0;
//     if (couponId) {
//       const coupon = await Coupon.findById(couponId);
//       couponAmount = (parseInt(subtotal) * coupon.discountamount) / 100;
//       couponCode = coupon.couponcode;
//     }

//     const newOrder = new Order({
//       orderId,
//       user: userId,
//       items: cart.product.map((item) => ({
//         productId: item.productId._id,
//         title: item.productId.title,
//         image: item.productId.image,
//         productPrice:
//           item.productId.discountPrice > 0
//             ? item.productId.discountPrice
//             : item.productId.price,
//         quantity: item.quantity,
//         price:
//           item.productId.discountPrice > 0
//             ? item.productId.discountPrice * item.quantity
//             : item.productId.price * item.quantity,
//         status: status === "Success" ? "Confirmed" : "Pending",
//         // Or any default status you prefer
//       })),
//       billTotal: couponId ? parseInt(totalAmount) : parseInt(subtotal),
//       shippingAddress: {
//         houseName: selectedAddress.houseName,
//         street: selectedAddress.street,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         country: selectedAddress.country,
//         postalCode: selectedAddress.postalCode,
//       },
//       paymentMethod,
//       paymentStatus: status,
//       couponAmount,
//       couponCode,
//       couponId,
//     });

//     await newOrder.save();
//     if (newOrder.paymentStatus == "Success") {
//       for (const item of newOrder.items) {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with id ${item.productId} not found`);
//         }
//         product.stock -= item.quantity;
//         await product.save();
//       }

//       await Cart.findOneAndDelete({ userId });

//       res
//         .status(201)
//         .json({ success: true, message: "Order placed successfully" });
//     } else if (newOrder.paymentStatus === "Failed") {
//       await Cart.findOneAndDelete({ userId });
//       res.status(201).json({ success: true, message: "Payment failed retry" });
//     }
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },

// onlineOrderPlacing: async (req, res) => {
//   try {
//     console.log('Received order data:', req.body);

//     const { order_id, payment_id, signature, status } = req.body;

//     console.log('Verifying payment signature...');
//     const isValid = verifyPaymentSignature(
//       { 
//         order_id, 
//         payment_id, 
//         signature 
//       }, 
//       process.env.RAZORPAY_SECRET
//     );

//     console.log('Signature verification result:', isValid);

//     if (!isValid) {
//       console.log('Invalid payment signature');
//       return res.status(400).json({ success: false, message: "Invalid payment signature" });
//     }

//     // Rest of your order processing logic...
//     console.log('Processing order...');

//     // After successful order processing
//     console.log('Order processed successfully');
//     res.status(200).json({ success: true, message: "Order placed successfully" });

//   } catch (error) {
//     console.error('Error in onlineOrderPlacing:', error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },

onlineOrderPlacing: async (req, res) => {
  try {
    console.log('Received order data:', req.body);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, status } = req.body;

    console.log('Verifying payment signature...');
    const isValid = verifyPaymentSignature(
      { 
        order_id: razorpay_order_id, 
        payment_id: razorpay_payment_id, 
        signature: razorpay_signature 
      }, 
      process.env.RAZORPAY_SECRET
    );

    console.log('Signature verification result:', isValid);

    if (!isValid) {
      console.log('Invalid payment signature');
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Find the order in the database
    const order = await Order.findOne({ 'razorpay_order_id': razorpay_order_id });
    
    if (!order) {
      console.log('Order not found');
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Update order status
    order.paymentStatus = 'Success';
    await order.save();

    console.log('Order updated successfully');
    res.status(200).json({ success: true, message: "Order placed successfully" });

  } catch (error) {
    console.error('Error in onlineOrderPlacing:', error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
},



// createRazorpayOrder : async(req, res)=> {
//   try {
//     const { totalAmount, receipt } = req.body;

//     // Ensure receipt is no longer than 40 characters
//     const truncatedReceipt = receipt.substring(0, 40);

//     const orderOptions = {
//       amount: totalAmount * 100, // Convert to paise
//       currency: 'INR',
//       receipt: truncatedReceipt
//     };

//     const order = await razorpayInstance.orders.create(orderOptions);
//     res.json({ success: true, order });
//   } catch (error) {
//     console.error('Razorpay error:', error);
//     res.status(500).json({ success: false, message: 'Error creating Razorpay order' });
//   }
// },





  cancelOrder: async (req, res) => {
    try {
      const { orderId, itemId, cancellationReason } = req.body;
      const order = await Order.findById(orderId);
      const userId = req.session.user.id;
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const item = order.items.find((item) => item._id == itemId);

      if (!item) {
        return res.status(404).json({ message: "Item not found in the order" });
      }

      item.status = "Cancelled";
      item.cancellationReason = cancellationReason;

      const refundAmount = item.productPrice * item.quantity;
      order.billTotal -= refundAmount;

      const allItemsCancelled = order.items.every(
        (item) => item.status === "Cancelled"
      );

      if (allItemsCancelled) {
        order.orderStatus = "Cancelled";
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      product.stock += item.quantity;
      await product.save();

      if (
        order.paymentMethod === "razorpay" ||
        order.paymentMethod === "wallet"
      ) {
        const wallet = await Wallet.findOne({ user: userId });
        if (!wallet) {
          throw new Error(`Wallet for user ${order.user._id} not found`);
        }

        const transaction = {
          amount: refundAmount,
          description: `Refund for ${item.name} ${orderId}`,
          type: "Refund",
          transcationDate: new Date(),
        };
        wallet.transactions.push(transaction);

        wallet.walletBalance += refundAmount;

        order.paymentStatus = "Refunded";
        await wallet.save();
      }

      await order.save();

      res
        .status(200)
        .json({ message: "Order item cancelled successfully", order });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ message: "An error occurred while cancelling the order item" });
    }
  },
 
  returnOrder: async (req, res) => {
    try {
      const { orderId, itemId, returnReason } = req.body;

      const order = await Order.findById(orderId);
      const userId = req.session.user.id;

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const item = order.items.find((item) => item._id == itemId);

      if (!item) {
        return res.status(404).json({ message: "Item not found in the order" });
      }

      item.status = "Returned";
      item.returnReason = returnReason;

      const refundAmount = item.productPrice * item.quantity;
      order.billTotal -= refundAmount;

      if (
        order.paymentMethod === "razorpay" ||
        order.paymentMethod === "wallet"
      ) {
        const wallet = await Wallet.findOne({ user: userId });
        if (!wallet) {
          throw new Error(`Wallet for user ${order.user._id} not found`);
        }

        const transaction = {
          amount: refundAmount,
          description: `Return refund for ${item.name} ${orderId}`,
          type: "Refund",
          transcationDate: new Date(),
        };
        wallet.transactions.push(transaction);

        wallet.walletBalance += refundAmount;

        order.paymentStatus = "Refunded";
        await wallet.save();
      }

      const allItemsReturned = order.items.every(
        (item) => item.status === "Returned"
      );

      if (allItemsReturned) {
        order.orderStatus = "Returned";
      }

      await order.save();
      res.status(201).json({message:"Item returned successfully"})
    } catch (error) {
      console.log(error.message);
    }
  },



  checkWalletBalance: async (req, res) => {
    try {
      const userId = req.session.user.id;
      const totalAmount = parseFloat(req.query.totalAmount);

      const wallet = await Wallet.findOne({ user: userId });

      if (!wallet) {
        return res
          .status(404)
          .json({ success: false, message: "Wallet not found" });
      }

      if (wallet.walletBalance >= totalAmount) {
        res.json({ success: true });
      } else {
        res.json({ success: false, message: "Insufficient wallet balance" });
      }
    } catch (error) {
      console.log("Error checking wallet", error.message);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },


  walletPlaceOrder: async (req, res) => {
    try {
      const userId = req.session.user.id;
      const cart = await Cart.findOne({ userId }).populate("product.productId");
  
      if (!cart || !cart.product.length) {
        return res.status(400).json({ success: false, message: "Cart is empty" });
      }
  
      const orderId = uuidv4();
  
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
  
      const { addressIndex, totalAmount, paymentMethod, couponId, subtotal } =
        req.body;
      const { status } = req.query;
      const selectedAddress = user.address[addressIndex];
      let couponAmount = 0;
      let couponCode = 0;
      if (couponId) {
        const coupon = await Coupon.findById(couponId);
        couponAmount = (parseInt(subtotal) * coupon.discountamount) / 100;
        couponCode = coupon.couponcode;
      }
  
      const newOrder = new Order({
        orderId,
        user: userId,
        items: cart.product.map((item) => ({
          productId: item.productId._id,
          name: item.productId.name,
          image: item.productId.image,
          productPrice:
            item.productId.discountPrice > 0
              ? item.productId.discountPrice
              : item.productId.price,
          quantity: item.quantity,
          price:
            item.productId.discountPrice > 0
              ? item.productId.discountPrice * item.quantity
              : item.productId.price * item.quantity,
          status: "Confirmed",
        })),
        billTotal: couponId ? parseInt(totalAmount) : parseInt(subtotal),
        shippingAddress: {
          houseName: selectedAddress.houseName,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          country: selectedAddress.country,
          postalCode: selectedAddress.postalCode,
        },
        paymentMethod,
        paymentStatus: status,
        couponAmount,
        couponCode,
        couponId,
      });
  
      await newOrder.save();
  
      if (newOrder.paymentStatus == "Success") {
        for (const item of newOrder.items) {
          const product = await Product.findById(item.productId);
          if (!product) {
            throw new Error(`Product with id ${item.productId} not found`);
          }
          product.stock -= item.quantity;
          await product.save();
        }
  
        const wallet = await Wallet.findOne({ user: userId });
        if (!wallet) {
          throw new Error(`Wallet for user ${userId} not found`);
        }
  
        const transaction = {
          amount: newOrder.billTotal,
          description: `Payment for order ${orderId}`,
          type: "Debit",
          transcationDate: new Date(),
        };
        wallet.transactions.push(transaction);
  
        wallet.walletBalance -= newOrder.billTotal;
  
        await wallet.save();
  
        await Cart.findOneAndDelete({ userId });
  
        res.status(201).json({ success: true, message: "Order placed successfully" });
      } else {
        await Cart.findOneAndDelete({ userId });
        res.status(201).json({ success: true, message: "Payment failed retry" });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },





 
 
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


// placeOrder: async (req, res) => {
//     try {
//       const userId = req.session.user.id;
//       const cart = await Cart.findOne({ userId }).populate("product.productId");
  
//       if (!cart || !cart.product.length) {
//         return res.status(400).json({ success: false, message: "Cart is empty" });
//       }
  
//       const orderId = uuidv4();
//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ success: false, message: "User not found" });
//       }
  
//       // Calculate billTotal
//       let billTotal = 0;
//       for (const item of cart.product) {
//         billTotal += item.productId.price * item.quantity;
//       }
  
//       const { addressIndex, paymentMethod } = req.body;
//       const selectedAddress = user.address[addressIndex];
  
//       if (paymentMethod !== "Cash On Delivery") {
//         return res.status(400).json({ success: false, message: "Invalid payment method" });
//       }
  
//       const newOrder = new Order({
//         orderId,
//         user: userId,
//         items: cart.product.map((item) => ({
//           productId: item.productId._id,
//           name: item.productId.name,
//           name: item.productId.name,
//           image: item.productId.image,
//           productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
//           quantity: item.quantity,
//           price: item.productId.discountPrice > 0 ? item.productId.discountPrice * item.quantity : item.productId.price * item.quantity,
//         })),
//         billTotal: billTotal,
//         shippingAddress: {
//           houseName: selectedAddress.houseName,
//           street: selectedAddress.street,
//           city: selectedAddress.city,
//           state: selectedAddress.state,
//           country: selectedAddress.country,
//           postalCode: selectedAddress.postalCode,
//         },
//         paymentMethod,
//       });
  
//       // Save order to the database
//       await newOrder.save();
  
//       // Update product stock
//       for (const item of newOrder.items) {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with id ${item.productId} not found`);
//         }
  
//         // Ensure stock is a valid number
//         if (isNaN(product.stock)) {
//           product.stock = 0;
//         }
//         product.stock -= item.quantity;
  
//         // Validate that stock is not negative
//         if (product.stock < 0) {
//           product.stock = 0; // Handle as needed
//         }
  
//         await product.save();
//       }
  
//       // Clear user's cart after successful order placement
//       await Cart.findOneAndDelete({ userId });
  
//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } catch (error) {
//       console.error("Error placing order:", error);
//       res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
//   },
  

  // Cancel Order

  // placeOrder: async (req, res) => {
  //   try {
  //     const userId = req.session.user.id;
  //     const cart = await Cart.findOne({ userId }).populate("product.productId");
  
  //     if (!cart || !cart.product.length) {
  //       return res.status(400).json({ success: false, message: "Cart is empty" });
  //     }
  
  //     const orderId = uuidv4();
  //     const user = await User.findById(userId);
  //     if (!user) {
  //       return res.status(404).json({ success: false, message: "User not found" });
  //     }
  
  //     const { addressIndex, paymentMethod, totalAmount, couponId, subtotal } = req.body;
  //     const selectedAddress = user.address[addressIndex];
  
  //     if (paymentMethod === "razorpay") {
  //       const options = {
  //         amount: Math.round(parseFloat(totalAmount) * 100), // Razorpay expects amount in cents
  //         currency: "USD",
  //         receipt: `receipt_${orderId}`,
  //       };
  
  //       razorpayInstance.orders.create(options, (err, order) => {
  //         if (err) {
  //           console.error("Razorpay error:", err);
  //           return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
  //         }
  
  //         res.status(200).json({
  //           success: true,
  //           message: "Order Created",
  //           order_id: order.id,
  //           amount: Math.round(totalAmount * 100),
  //           key_id: process.env.RAZOR_PAY_KEY,
  //           product_name: "Order Items",
  //           description: "Purchase from our store",
  //           contact: user.phone || "",
  //           name: user.name,
  //           email: user.email,
  //         });
  //       });
  //     } else if (paymentMethod === "Cash On Delivery") {
  //       let couponAmount = 0;
  //       let couponCode = "";
  //       if (couponId) {
  //         const coupon = await Coupon.findById(couponId);
  //         if (coupon) {
  //           couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
  //           couponCode = coupon.couponcode;
  //         }
  //       }
  
  //       const newOrder = new Order({
  //         orderId,
  //         user: userId,
  //         items: cart.product.map((item) => ({
  //           productId: item.productId._id,
  //           name: item.productId.name,
  //           image: item.productId.image,
  //           productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
  //           quantity: item.quantity,
  //           price: item.productId.discountPrice > 0 ? item.productId.discountPrice * item.quantity : item.productId.price * item.quantity,
  //         })),
  //         billTotal: couponId ? parseFloat(totalAmount) : parseFloat(subtotal),
  //         shippingAddress: {
  //           houseName: selectedAddress.houseName,
  //           street: selectedAddress.street,
  //           city: selectedAddress.city,
  //           state: selectedAddress.state,
  //           country: selectedAddress.country,
  //           postalCode: selectedAddress.postalCode,
  //         },
  //         paymentMethod,
  //         couponAmount,
  //         couponCode,
  //         couponId,
  //       });
  
  //       await newOrder.save();
  
  //       // Update product stock
  //       for (const item of newOrder.items) {
  //         await Product.findByIdAndUpdate(item.productId, {
  //           $inc: { stock: -item.quantity }
  //         });
  //       }
  
  //       await Cart.findOneAndDelete({ userId });
  
  //       res.status(201).json({ success: true, message: "Order placed successfully" });
  //     } else {
  //       res.status(400).json({ success: false, message: "Invalid payment method" });
  //     }
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //     res.status(500).json({ success: false, message: "Internal Server Error" });
  //   }
  // },




  // onlinePlaceOrder: async (req, res) => {
  //   try {
  //     const userId = req.session.user.id;
  //     const cart = await Cart.findOne({ userId }).populate("product.productId");

  //     if (!cart || !cart.product.length) {
  //       return res.status(400).json({ success: false, message: "Cart is empty" });
  //     }
  //     const orderId = uuidv4();

  //     const user = await User.findById(userId);
  //     if (!user) {
  //       return res.status(404).json({ success: false, message: "User not found" });
  //     }

  //     const { addressIndex, status, totalAmount, paymentMethod } = req.query;
  //     const { couponId, subtotal } = req.body;
  //     const selectedAddress = user.address[addressIndex];

  //     let couponAmount = 0;
  //     let couponCode = 0;
  //     if (couponId) {
  //       const coupon = await Coupon.findById(couponId);
  //       couponAmount = (parseInt(subtotal) * coupon.discountamount) / 100;
  //       couponCode = coupon.couponcode;
  //     }

  //     const newOrder = new Order({
  //       orderId,
  //       user: userId,
  //       items: cart.product.map((item) => ({
  //         productId: item.productId._id,
  //         name: item.productId.name,
  //         image: item.productId.image,
  //         productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
  //         quantity: item.quantity,
  //         price: item.productId.discountPrice > 0 ? item.productId.discountPrice * item.quantity : item.productId.price * item.quantity,
  //         status: status === "Success" ? "Confirmed" : "Pending",
  //       })),
  //       billTotal: couponId ? parseInt(totalAmount) : parseInt(subtotal),
  //       shippingAddress: {
  //         houseName: selectedAddress.houseName,
  //         street: selectedAddress.street,
  //         city: selectedAddress.city,
  //         state: selectedAddress.state,
  //         country: selectedAddress.country,
  //         postalCode: selectedAddress.postalCode,
  //       },
  //       paymentMethod,
  //       paymentStatus: status,
  //       couponAmount,
  //       couponCode,
  //       couponId,
  //     });

  //     await newOrder.save();
  //     if (newOrder.paymentStatus == "Success") {
  //       for (const item of newOrder.items) {
  //         const product = await Product.findById(item.productId);
  //         if (!product) {
  //           throw new Error(`Product with id ${item.productId} not found`);
  //         }
  //         product.stock -= item.quantity;
  //         await product.save();
  //       }

  //       await Cart.findOneAndDelete({ userId });

  //       res.status(201).json({ success: true, message: "Order placed successfully" });
  //     } else if (newOrder.paymentStatus === "Failed") {
  //       await Cart.findOneAndDelete({ userId });
  //       res.status(201).json({ success: true, message: "Payment failed retry" });
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //     res.status(500).json({ success: false, message: "Internal Server Error" });
  //   }
  // },











  // cancelOrder: async (req, res) => {
  //   try {
  //     const { orderId, itemId, cancellationReason } = req.body;
  //     // Find the order by orderId
  //     const order = await Order.findById(orderId);
  //     const userId = req.session.user.id;
  //     // If order is not found
  //     if (!order) {
  //       return res.status(404).json({ message: "Order not found" });
  //     }

  //     // Find the item within the order by itemId
  //     const item = order.items.find((item) => item._id.toString() === itemId);

  //     // If item is not found
  //     if (!item) {
  //       return res.status(404).json({ message: "Item not found in the order" });
  //     }

  //     // Update the status of the item to 'Cancelled'
  //     item.status = "Cancelled";
  //     item.cancellationReason = cancellationReason;

  //     // Decrease the item price from the billTotal
  //     const refundAmount = item.productPrice * item.quantity;
  //     order.billTotal -= refundAmount;

  //     // Check if all items in the order are cancelled
  //     const allItemsCancelled = order.items.every(
  //       (item) => item.status === "Cancelled"
  //     );

  //     // If all items are cancelled, update the order status to 'Cancelled'
  //     if (allItemsCancelled) {
  //       order.orderStatus = "Cancelled";
  //     }

  //     // Save the updated order
  //     await order.save();

  //     // Update the product stock
  //     const product = await Product.findById(item.productId);
  //     if (!product) {
  //       throw new Error(`Product with id ${item.productId} not found`);
  //     }
  //     product.stock += item.quantity;
  //     await product.save();

  //     res.status(200).json({ message: "Order item cancelled successfully", order });
  //   } catch (error) {
  //     console.error("Error:", error);
  //     res.status(500).json({ message: "An error occurred while cancelling the order item" });
  //   }
  // },

  // Load Order View
 


//  last
//  placeOrder : async (req, res) => {
//     try {
//         const userId = req.session.user.id;
//         const cart = await Cart.findOne({ userId }).populate("product.productId");

//         if (!cart || !cart.product.length) {
//             return res.status(400).json({ success: false, message: "Cart is empty" });
//         }

//         const orderId = uuidv4();
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         const { addressIndex, paymentMethod, totalAmount, couponId, subtotal } = req.body;
//         const { status } = req.query;
//         const selectedAddress = user.address[addressIndex];

//         let couponAmount = 0;
//         let couponCode = "";
//         if (couponId) {
//             const coupon = await Coupon.findById(couponId);
//             if (coupon) {
//                 couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//                 couponCode = coupon.couponcode;
//             }
//         }

//         const newOrder = new Order({
//             orderId,
//             user: userId,
//             items: cart.product.map((item) => ({
//                 productId: item.productId._id,
//                 name: item.productId.name,
//                 image: item.productId.image,
//                 productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
//                 quantity: item.quantity,
//                 price: item.productId.discountPrice > 0 ? item.productId.discountPrice * item.quantity : item.productId.price * item.quantity,
//                 status: paymentMethod === "razorpay" && status === "Success" ? "Confirmed" : "Pending",
//             })),
//             billTotal: couponId ? parseFloat(totalAmount) : parseFloat(subtotal),
//             shippingAddress: {
//                 houseName: selectedAddress.houseName,
//                 street: selectedAddress.street,
//                 city: selectedAddress.city,
//                 state: selectedAddress.state,
//                 country: selectedAddress.country,
//                 postalCode: selectedAddress.postalCode,
//             },
//             paymentMethod,
//             paymentStatus: status || "Pending",
//             couponAmount,
//             couponCode,
//             couponId,
//         });

//         if (paymentMethod === "razorpay") {
//             const options = {
//                 amount: Math.round(parseFloat(totalAmount) * 100), // Razorpay expects amount in cents
//                 currency: "USD",
//                 receipt: `receipt_${orderId}`,
//             };

//             razorpayInstance.orders.create(options, async (err, order) => {
//                 if (err) {
//                     console.error("Razorpay error:", err);
//                     return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
//                 }

//                 await newOrder.save();
//                 res.status(200).json({
//                     success: true,
//                     message: "Order Created",
//                     order_id: order.id,
//                     amount: Math.round(totalAmount * 100),
//                     key_id: process.env.RAZOR_PAY_KEY,
//                     product_name: "Order Items",
//                     description: "Purchase from our store",
//                     contact: user.phone || "",
//                     name: user.name,
//                     email: user.email,
//                 });
//             });
//         } else if (paymentMethod === "Cash On Delivery") {
//             await newOrder.save();

//             // Update product stock for COD
//             for (const item of newOrder.items) {
//                 await Product.findByIdAndUpdate(item.productId, {
//                     $inc: { stock: -item.quantity }
//                 });
//             }

//             await Cart.findOneAndDelete({ userId });

//             res.status(201).json({ success: true, message: "Order placed successfully" });
//         } else {
//             res.status(400).json({ success: false, message: "Invalid payment method" });
//         }

//         if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Success") {
//             for (const item of newOrder.items) {
//                 const product = await Product.findById(item.productId);
//                 if (!product) {
//                     throw new Error(`Product with id ${item.productId} not found`);
//                 }
//                 product.stock -= item.quantity;
//                 await product.save();
//             }

//             await Cart.findOneAndDelete({ userId });
//         } else if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Failed") {
//             await Cart.findOneAndDelete({ userId });
//             res.status(201).json({ success: true, message: "Payment failed, retry" });
//         }
//     } catch (error) {
//         console.error("Error placing order:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// },


// new sub
// placeOrder : async (req, res) => {
//   try {
//     const userId = req.session.user.id;
//     const cart = await Cart.findOne({ userId }).populate("product.productId");

//     if (!cart || !cart.product.length) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const orderId = uuidv4();
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const { addressIndex, paymentMethod, totalAmount, couponId, subtotal } = req.body;
//     const { status } = req.query;

//     if (!subtotal || isNaN(subtotal)) {
//       return res.status(400).json({ success: false, message: "Invalid subtotal" });
//     }

//     const selectedAddress = user.address[addressIndex];
//     if (!selectedAddress) {
//       return res.status(400).json({ success: false, message: "Invalid address" });
//     }

//     let couponAmount = 0;
//     let couponCode = "";
//     if (couponId) {
//       const coupon = await Coupon.findById(couponId);
//       if (coupon) {
//         couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//         couponCode = coupon.couponcode;
//       }
//     }

//     const items = cart.product.map((item) => {
//       if (!item.productId.name) {
//         throw new Error('Product name is missing');
//       }
//       const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//       return {
//         productId: item.productId._id,
//         name: item.productId.name,
//         image: item.productId.image,
//         productPrice: price,
//         quantity: item.quantity,
//         price: price * item.quantity,
//         status: paymentMethod === "razorpay" && status === "Success" ? "Confirmed" : "Pending",
//       };
//     });

//     const billTotal = couponId ? parseFloat(totalAmount) : parseFloat(subtotal);
//     if (isNaN(billTotal)) {
//       return res.status(400).json({ success: false, message: "Invalid total amount" });
//     }

//     const newOrder = new Order({
//       orderId,
//       user: userId,
//       items,
//       billTotal,
//       shippingAddress: {
//         houseName: selectedAddress.houseName,
//         street: selectedAddress.street,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         country: selectedAddress.country,
//         postalCode: selectedAddress.postalCode,
//       },
//       paymentMethod,
//       paymentStatus: status || "Pending",
//       couponAmount,
//       couponCode,
//       couponId,
//     });

//     if (paymentMethod === "razorpay") {
//       const options = {
//         amount: Math.round(parseFloat(totalAmount) * 100), // Razorpay expects amount in paise
//         currency: "INR",
//         receipt: `receipt_${orderId}`,
//       };

//       razorpayInstance.orders.create(options, async (err, order) => {
//         if (err) {
//           console.error("Razorpay error:", err);
//           return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
//         }

//         await newOrder.save();
//         res.status(200).json({
//           success: true,
//           message: "Order Created",
//           order_id: order.id,
//           amount: Math.round(totalAmount * 100),
//           key_id: process.env.RAZOR_PAY_KEY,
//           product_name: "Order Items",
//           description: "Purchase from our store",
//           contact: user.phone || "",
//           name: user.name,
//           email: user.email,
//         });
//       });
//     } else if (paymentMethod === "Cash On Delivery") {
//       await newOrder.save();

//       // Update product stock for COD
//       for (const item of newOrder.items) {
//         await Product.findByIdAndUpdate(item.productId, {
//           $inc: { stock: -item.quantity }
//         });
//       }

//       await Cart.findOneAndDelete({ userId });

//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } else {
//       res.status(400).json({ success: false, message: "Invalid payment method" });
//     }

//     if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Success") {
//       for (const item of newOrder.items) {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with id ${item.productId} not found`);
//         }
//         product.stock -= item.quantity;
//         await product.save();
//       }

//       await Cart.findOneAndDelete({ userId });
//     } else if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Failed") {
//       await Cart.findOneAndDelete({ userId });
//       res.status(201).json({ success: true, message: "Payment failed, retry" });
//     }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },


// debug
// placeOrder : async (req, res) => {
//   try {
//     const userId = req.session.user.id;
//     const cart = await Cart.findOne({ userId }).populate("product.productId");

//     if (!cart || !cart.product.length) {
//       console.log("Cart is empty for user:", userId);
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const orderId = uuidv4();
//     const user = await User.findById(userId);
//     if (!user) {
//       console.log("User not found for ID:", userId);
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const { addressIndex, paymentMethod, totalAmount, couponId, subtotal } = req.body;
//     const { status } = req.query;

//     // Debugging: Log the received values
//     console.log("Received values:", { addressIndex, paymentMethod, totalAmount, couponId, subtotal });

//     // Validate subtotal
//     if (!subtotal || isNaN(parseFloat(subtotal))) {
//       console.log("Invalid subtotal:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid subtotal" });
//     }

//     const selectedAddress = user.address[addressIndex];
//     if (!selectedAddress) {
//       console.log("Invalid address index:", addressIndex);
//       return res.status(400).json({ success: false, message: "Invalid address" });
//     }

//     let couponAmount = 0;
//     let couponCode = "";
//     if (couponId) {
//       const coupon = await Coupon.findById(couponId);
//       if (coupon) {
//         couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//         couponCode = coupon.couponcode;
//       }
//     }

//     const items = cart.product.map((item) => {
//       if (!item.productId.name) {
//         throw new Error('Product name is missing');
//       }
//       const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//       return {
//         productId: item.productId._id,
//         name: item.productId.name,
//         image: item.productId.image,
//         productPrice: price,
//         quantity: item.quantity,
//         price: price * item.quantity,
//         status: paymentMethod === "razorpay" && status === "Success" ? "Confirmed" : "Pending",
//       };
//     });

//     const billTotal = couponId ? parseFloat(totalAmount) : parseFloat(subtotal);
//     if (isNaN(billTotal)) {
//       console.log("Invalid total amount:", totalAmount, "or subtotal:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid total amount" });
//     }

//     const newOrder = new Order({
//       orderId,
//       user: userId,
//       items,
//       billTotal,
//       shippingAddress: {
//         houseName: selectedAddress.houseName,
//         street: selectedAddress.street,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         country: selectedAddress.country,
//         postalCode: selectedAddress.postalCode,
//       },
//       paymentMethod,
//       paymentStatus: status || "Pending",
//       couponAmount,
//       couponCode,
//       couponId,
//     });

//     if (paymentMethod === "razorpay") {
//       const options = {
//         amount: Math.round(parseFloat(totalAmount) * 100), // Razorpay expects amount in paise
//         currency: "INR",
//         receipt: `receipt_${orderId}`,
//       };

//       razorpayInstance.orders.create(options, async (err, order) => {
//         if (err) {
//           console.error("Razorpay error:", err);
//           return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
//         }

//         await newOrder.save();
//         res.status(200).json({
//           success: true,
//           message: "Order Created",
//           order_id: order.id,
//           amount: Math.round(totalAmount * 100),
//           key_id: process.env.RAZOR_PAY_KEY,
//           product_name: "Order Items",
//           description: "Purchase from our store",
//           contact: user.phone || "",
//           name: user.name,
//           email: user.email,
//         });
//       });
//     } else if (paymentMethod === "Cash On Delivery") {
//       await newOrder.save();

//       // Update product stock for COD
//       for (const item of newOrder.items) {
//         await Product.findByIdAndUpdate(item.productId, {
//           $inc: { stock: -item.quantity }
//         });
//       }

//       await Cart.findOneAndDelete({ userId });

//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } else {
//       res.status(400).json({ success: false, message: "Invalid payment method" });
//     }

//     if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Success") {
//       for (const item of newOrder.items) {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with id ${item.productId} not found`);
//         }
//         product.stock -= item.quantity;
//         await product.save();
//       }

//       await Cart.findOneAndDelete({ userId });
//     } else if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Failed") {
//       await Cart.findOneAndDelete({ userId });
//       res.status(201).json({ success: true, message: "Payment failed, retry" });
//     }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },

// new
// placeOrder : async (req, res) => {
//   try {
//     const userId = req.session.user.id;
//     const cart = await Cart.findOne({ userId }).populate("product.productId");

//     if (!cart || !cart.product.length) {
//       console.log("Cart is empty for user:", userId);
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const orderId = uuidv4();
//     const user = await User.findById(userId);
//     if (!user) {
//       console.log("User not found for ID:", userId);
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const { addressIndex, paymentMethod, totalAmount, couponcode } = req.body;
//     let { subtotal } = req.body;
//     const { status } = req.query;

//     // Debugging: Log the received values
//     console.log("Received values:", { addressIndex, paymentMethod, totalAmount, couponcode, subtotal });

//     // Validate subtotal and calculate it if it's undefined
//     if (!subtotal || isNaN(parseFloat(subtotal))) {
//       subtotal = cart.product.reduce((acc, item) => {
//         const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//         return acc + price * item.quantity;
//       }, 0);
//       console.log("Calculated subtotal:", subtotal);
//     }

//     // Check if the calculated subtotal is valid
//     if (!subtotal || isNaN(parseFloat(subtotal))) {
//       console.log("Invalid subtotal after calculation:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid subtotal" });
//     }

//     const selectedAddress = user.address[addressIndex];
//     if (!selectedAddress) {
//       console.log("Invalid address index:", addressIndex);
//       return res.status(400).json({ success: false, message: "Invalid address" });
//     }

//     let couponAmount = 0;
//     let coupon = null;
//     if (couponcode) {
//       coupon = await Coupon.findOne({ couponcode });
//       if (coupon) {
//         couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//       }
//     }

//     const items = cart.product.map((item) => {
//       if (!item.productId.name) {
//         throw new Error('Product name is missing');
//       }
//       const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//       return {
//         productId: item.productId._id,
//         name: item.productId.name,
//         image: item.productId.image,
//         productPrice: price,
//         quantity: item.quantity,
//         price: price * item.quantity,
//         status: paymentMethod === "razorpay" && status === "Success" ? "Confirmed" : "Pending",
//       };
//     });

//     const billTotal = coupon ? parseFloat(totalAmount) : parseFloat(subtotal);
//     if (isNaN(billTotal)) {
//       console.log("Invalid total amount:", totalAmount, "or subtotal:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid total amount" });
//     }

//     const newOrder = new Order({
//       orderId,
//       user: userId,
//       items,
//       billTotal,
//       shippingAddress: {
//         houseName: selectedAddress.houseName,
//         street: selectedAddress.street,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         country: selectedAddress.country,
//         postalCode: selectedAddress.postalCode,
//       },
//       paymentMethod,
//       paymentStatus: status || "Pending",
//       couponAmount,
//       couponCode: coupon ? coupon.couponcode : "",
//       couponId: coupon ? coupon._id : null,
//     });

//     if (paymentMethod === "razorpay") {
//       const options = {
//         amount: Math.round(parseFloat(totalAmount) * 100), // Razorpay expects amount in paise
//         currency: "INR",
//         receipt: `receipt_${orderId}`,
//       };

//       razorpayInstance.orders.create(options, async (err, order) => {
//         if (err) {
//           console.error("Razorpay error:", err);
//           return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
//         }

//         await newOrder.save();
//         res.status(200).json({
//           success: true,
//           message: "Order Created",
//           order_id: order.id,
//           amount: Math.round(totalAmount * 100),
//           key_id: process.env.RAZOR_PAY_KEY,
//           product_name: "Order Items",
//           description: "Purchase from our store",
//           contact: user.phone || "",
//           name: user.name,
//           email: user.email,
//         });
//       });
//     } else if (paymentMethod === "Cash On Delivery") {
//       await newOrder.save();

//       // Update product stock for COD
//       for (const item of newOrder.items) {
//         await Product.findByIdAndUpdate(item.productId, {
//           $inc: { stock: -item.quantity }
//         });
//       }

//       await Cart.findOneAndDelete({ userId });

//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } else {
//       res.status(400).json({ success: false, message: "Invalid payment method" });
//     }

//     if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Success") {
//       for (const item of newOrder.items) {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with id ${item.productId} not found`);
//         }
//         product.stock -= item.quantity;
//         await product.save();
//       }

//       await Cart.findOneAndDelete({ userId });
//     } else if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Failed") {
//       await Cart.findOneAndDelete({ userId });
//       res.status(201).json({ success: true, message: "Payment failed, retry" });
//     }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },

// new 2 test worked not opening
// placeOrder: async (req, res) => {
//   console.log("placeOrder function called");
//   try {
//     const userId = req.session.user.id;
//     console.log("User ID:", userId);

//     const cart = await Cart.findOne({ userId }).populate("product.productId");
//     if (!cart || !cart.product.length) {
//       console.log("Cart is empty for user:", userId);
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const orderId = uuidv4();
//     const user = await User.findById(userId);
//     if (!user) {
//       console.log("User not found for ID:", userId);
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const { addressIndex, paymentMethod, totalAmount, couponcode } = req.body;
//     let { subtotal } = req.body;
//     const { status } = req.query;

//     console.log("Received values:", { addressIndex, paymentMethod, totalAmount, couponcode, subtotal });

//     // Validate subtotal and calculate it if it's undefined
//     if (!subtotal || isNaN(parseFloat(subtotal))) {
//       subtotal = cart.product.reduce((acc, item) => {
//         const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//         return acc + price * item.quantity;
//       }, 0);
//       console.log("Calculated subtotal:", subtotal);
//     }

//     // Check if the calculated subtotal is valid
//     if (!subtotal || isNaN(parseFloat(subtotal))) {
//       console.log("Invalid subtotal after calculation:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid subtotal" });
//     }

//     const selectedAddress = user.address[addressIndex];
//     if (!selectedAddress) {
//       console.log("Invalid address index:", addressIndex);
//       return res.status(400).json({ success: false, message: "Invalid address" });
//     }

//     let couponAmount = 0;
//     let coupon = null;
//     if (couponcode) {
//       coupon = await Coupon.findOne({ couponcode });
//       if (coupon) {
//         couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//         console.log("Coupon applied:", couponcode, "Discount amount:", couponAmount);
//       } else {
//         console.log("Invalid coupon code:", couponcode);
//       }
//     }

//     const items = cart.product.map((item) => {
//       if (!item.productId.name) {
//         throw new Error('Product name is missing');
//       }
//       const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//       return {
//         productId: item.productId._id,
//         name: item.productId.name,
//         image: item.productId.image,
//         productPrice: price,
//         quantity: item.quantity,
//         price: price * item.quantity,
//         status: paymentMethod === "razorpay" && status === "Success" ? "Confirmed" : "Pending",
//       };
//     });

//     const billTotal = coupon ? parseFloat(totalAmount) : parseFloat(subtotal);
//     if (isNaN(billTotal)) {
//       console.log("Invalid total amount:", totalAmount, "or subtotal:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid total amount" });
//     }

//     const newOrder = new Order({
//       orderId,
//       user: userId,
//       items,
//       billTotal,
//       shippingAddress: {
//         houseName: selectedAddress.houseName,
//         street: selectedAddress.street,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         country: selectedAddress.country,
//         postalCode: selectedAddress.postalCode,
//       },
//       paymentMethod,
//       paymentStatus: status || "Pending",
//       couponAmount,
//       couponCode: coupon ? coupon.couponcode : "",
//       couponId: coupon ? coupon._id : null,
//     });

//     console.log("New order created:", newOrder);

//     if (paymentMethod === "razorpay") {
//       const receipt = `receipt_${orderId}`.substring(0, 40);
//       const options = {
//         amount: Math.round(parseFloat(totalAmount) * 100), // Razorpay expects amount in paise
//         currency: "INR",
//         receipt: receipt,
//       };

//       razorpayInstance.orders.create(options, async (err, order) => {
//         if (err) {
//           console.error("Razorpay error:", err);
//           return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
//         }

//         newOrder.razorpayOrderId = order.id;
//         await newOrder.save();
//         console.log("Razorpay order created:", order.id);
//         res.status(200).json({
//           success: true,
//           message: "Order Created",
//           order_id: order.id,
//           amount: Math.round(totalAmount * 100),
//           key_id: process.env.RAZOR_PAY_KEY,
//           product_name: "Order Items",
//           description: "Purchase from our store",
//           contact: user.phone || "",
//           name: user.name,
//           email: user.email,
//         });
//       });
//     } else if (paymentMethod === "Cash On Delivery") {
//       await newOrder.save();
//       console.log("Order placed with Cash On Delivery");

//       // Update product stock for COD
//       for (const item of newOrder.items) {
//         await Product.findByIdAndUpdate(item.productId, {
//           $inc: { stock: -item.quantity }
//         });
//       }

//       await Cart.findOneAndDelete({ userId });
//       console.log("Cart cleared for user:", userId);

//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } else {
//       res.status(400).json({ success: false, message: "Invalid payment method" });
//     }

//     if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Success") {
//       for (const item of newOrder.items) {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with id ${item.productId} not found`);
//         }
//         product.stock -= item.quantity;
//         await product.save();
//         console.log("Product stock updated:", product._id);
//       }

//       await Cart.findOneAndDelete({ userId });
//       console.log("Cart cleared for user:", userId);
//     } else if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Failed") {
//       await Cart.findOneAndDelete({ userId });
//       res.status(201).json({ success: true, message: "Payment failed, retry" });
//     }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },

// test 3 

// placeOrder: async (req, res) => {
//   console.log("placeOrder function called");
//   try {
//     const userId = req.session.user.id;
//     console.log("User ID:", userId);

//     const cart = await Cart.findOne({ userId }).populate("product.productId");
//     if (!cart || !cart.product.length) {
//       console.log("Cart is empty for user:", userId);
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const orderId = uuidv4();
//     const user = await User.findById(userId);
//     if (!user) {
//       console.log("User not found for ID:", userId);
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const { addressIndex, paymentMethod, totalAmount, couponcode } = req.body;
//     let { subtotal } = req.body;
//     const { status } = req.query;

//     console.log("Received values:", { addressIndex, paymentMethod, totalAmount, couponcode, subtotal });

//     // Validate subtotal and calculate it if it's undefined
//     if (!subtotal || isNaN(parseFloat(subtotal))) {
//       subtotal = cart.product.reduce((acc, item) => {
//         const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//         return acc + price * item.quantity;
//       }, 0);
//       console.log("Calculated subtotal:", subtotal);
//     }

//     // Check if the calculated subtotal is valid
//     if (!subtotal || isNaN(parseFloat(subtotal))) {
//       console.log("Invalid subtotal after calculation:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid subtotal" });
//     }

//     const selectedAddress = user.address[addressIndex];
//     if (!selectedAddress) {
//       console.log("Invalid address index:", addressIndex);
//       return res.status(400).json({ success: false, message: "Invalid address" });
//     }

//     let couponAmount = 0;
//     let coupon = null;
//     if (couponcode) {
//       coupon = await Coupon.findOne({ couponcode });
//       if (coupon) {
//         couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//         console.log("Coupon applied:", couponcode, "Discount amount:", couponAmount);
//       } else {
//         console.log("Invalid coupon code:", couponcode);
//       }
//     }

//     const items = cart.product.map((item) => {
//       if (!item.productId.name) {
//         throw new Error('Product name is missing');
//       }
//       const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//       return {
//         productId: item.productId._id,
//         name: item.productId.name,
//         image: item.productId.image,
//         productPrice: price,
//         quantity: item.quantity,
//         price: price * item.quantity,
//         status: paymentMethod === "razorpay" && status === "Success" ? "Confirmed" : "Pending",
//       };
//     });

//     const billTotal = coupon ? parseFloat(totalAmount) : parseFloat(subtotal);
//     if (isNaN(billTotal)) {
//       console.log("Invalid total amount:", totalAmount, "or subtotal:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid total amount" });
//     }

//     const newOrder = new Order({
//       orderId,
//       user: userId,
//       items,
//       billTotal,
//       shippingAddress: {
//         houseName: selectedAddress.houseName,
//         street: selectedAddress.street,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         country: selectedAddress.country,
//         postalCode: selectedAddress.postalCode,
//       },
//       paymentMethod,
//       paymentStatus: status || "Pending",
//       couponAmount,
//       couponCode: coupon ? coupon.couponcode : "",
//       couponId: coupon ? coupon._id : null,
//     });

//     console.log("New order created:", newOrder);

//     if (paymentMethod === "razorpay") {
//       const receipt = `receipt_${orderId}`.substring(0, 40);
//       const options = {
//         amount: Math.round(parseFloat(totalAmount) * 100), // Razorpay expects amount in paise
//         currency: "INR",
//         receipt: receipt,
//       };

//       razorpayInstance.orders.create(options, async (err, order) => {
//         if (err) {
//           console.error("Razorpay error:", err);
//           return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
//         }

//         newOrder.razorpayOrderId = order.id;
//         await newOrder.save();
//         console.log("Razorpay order created:", order.id);
//         res.status(200).json({
//           success: true,
//           message: "Order Created",
//           order_id: order.id,
//           amount: Math.round(totalAmount * 100),
//           key_id: process.env.RAZOR_PAY_KEY,
//           product_name: "Order Items",
//           description: "Purchase from our store",
//           contact: user.phone || "",
//           name: user.name,
//           email: user.email,
//         });
//       });
//     } else if (paymentMethod === "Cash On Delivery") {
//       await newOrder.save();
//       console.log("Order placed with Cash On Delivery");

//       // Update product stock for COD
//       for (const item of newOrder.items) {
//         await Product.findByIdAndUpdate(item.productId, {
//           $inc: { stock: -item.quantity }
//         });
//       }

//       await Cart.findOneAndDelete({ userId });
//       console.log("Cart cleared for user:", userId);

//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } else {
//       res.status(400).json({ success: false, message: "Invalid payment method" });
//     }

//     if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Success") {
//       for (const item of newOrder.items) {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with id ${item.productId} not found`);
//         }
//         product.stock -= item.quantity;
//         await product.save();
//         console.log("Product stock updated:", product._id); 
//       }

//       await Cart.findOneAndDelete({ userId });
//       console.log("Cart cleared for user:", userId);
//     } else if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Failed") {
//       await Cart.findOneAndDelete({ userId });
//       res.status(201).json({ success: true, message: "Payment failed, retry" });
//     }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },

  






// last
// onlineOrderPlacing : async (req, res) => {
//   const { addressIndex, status, totalAmount, paymentMethod } = req.query;
//   const { couponId, subtotal, razorpay_payment_id } = req.body;
  
//   const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

//   // Create a payment response object
//   const paymentResponse = {
//       order_id: razorpay_payment_id,
//       payment_id: razorpay_payment_id,
//       signature: razorpay_signature
//   };

//   // Verify payment signature
//   if (!verifyPaymentSignature(paymentResponse, razorpaySecret)) {
//       return res.status(400).json({ success: false, message: 'Invalid payment signature' });
//   }





//   try {
//       // Find the order based on the Razorpay payment ID or another unique identifier
//       const order = await Order.findOne({ razorpay_order_id: razorpay_payment_id });

//       if (!order) {
//           return res.status(404).json({ success: false, message: 'Order not found' });
//       }

//       // Update order based on payment status
//       if (status === 'Success') {
//           order.paymentStatus = 'Paid';
//           order.orderStatus = 'Confirmed';
//           // Update other order details as necessary
//       } else if (status === 'Failed') {
//           order.paymentStatus = 'Failed';
//           order.orderStatus = 'Payment Failed';
//           // Update other order details as necessary
//       }

//       // Save the updated order
//       await order.save();

//       // Respond to the client
//       res.json({ success: true, message: 'Order placed successfully' });
//   } catch (error) {
//       console.error('Error processing payment response:', error);
//       res.status(500).json({ success: false, message: 'Error processing payment response' });
//   }
// },

// new erking 
// onlineOrderPlacing : async (req, res) => {
//   const { addressIndex, status, totalAmount, paymentMethod } = req.query;
//   const { couponId, subtotal, razorpay_payment_id, razorpay_signature } = req.body;

//   console.log('Received query parameters:', { addressIndex, status, totalAmount, paymentMethod });
//   console.log('Received body parameters:', { couponId, subtotal, razorpay_payment_id, razorpay_signature });

//   const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
//   console.log('Razorpay Secret:', razorpaySecret);

//   // Create a payment response object
//   const paymentResponse = {
//       order_id: razorpay_payment_id,
//       payment_id: razorpay_payment_id,
//       signature: razorpay_signature
//   };

//   // Verify payment signature
//   const isSignatureValid = verifyPaymentSignature(paymentResponse, razorpaySecret);
//   console.log('Signature Valid:', isSignatureValid);

//   if (!isSignatureValid) {
//       console.log('Invalid payment signature');
//       return res.status(400).json({ success: false, message: 'Invalid payment signature' });
//   }

//   try {
//       // Find the order based on the Razorpay payment ID or another unique identifier
//       const order = await Order.findOne({ razorpay_order_id: razorpay_payment_id });

//       if (!order) {
//           console.log('Order not found');
//           return res.status(404).json({ success: false, message: 'Order not found' });
//       }

//       // Update order based on payment status
//       if (status === 'Success') {
//           order.paymentStatus = 'Paid';
//           order.orderStatus = 'Confirmed';
//           console.log('Order status updated to Confirmed');
//       } else if (status === 'Failed') {
//           order.paymentStatus = 'Failed';
//           order.orderStatus = 'Payment Failed';
//           console.log('Order status updated to Payment Failed');
//       }

//       // Save the updated order
//       await order.save();
//       console.log('Order saved successfully');

//       // Respond to the client
//       res.json({ success: true, message: 'Order placed successfully' });
//   } catch (error) {
//       console.error('Error processing payment response:', error);
//       res.status(500).json({ success: false, message: 'Error processing payment response' });
//   }
// },

// new nw
// onlineOrderPlacing : async (req, res) => {
//   // Log the entire request body to inspect incoming data
//   console.log('Received request body:', req.body);
  
//   const { addressIndex, status, totalAmount, paymentMethod } = req.query;
//   const { couponId, subtotal, razorpay_payment_id, razorpay_signature } = req.body;

//   const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

//   // Create a payment response object
//   const paymentResponse = {
//     order_id: razorpay_payment_id,
//     payment_id: razorpay_payment_id,
//     signature: razorpay_signature
//   };

//   // Log the payment response and Razorpay secret
//   console.log('Payment response:', paymentResponse);
//   console.log('Razorpay secret:', razorpaySecret);

//   // Verify payment signature
//   const isSignatureValid = verifyPaymentSignature(paymentResponse, razorpaySecret);
//   console.log('Is signature valid:', isSignatureValid);

//   if (!isSignatureValid) {
//     return res.status(400).json({ success: false, message: 'Invalid payment signature' });
//   }

//   try {
//     // Find the order based on the Razorpay payment ID or another unique identifier
//     const order = await Order.findOne({ razorpay_order_id: razorpay_payment_id });

//     // Log the order found in the database
//     console.log('Found order:', order);

//     if (!order) {
//       return res.status(404).json({ success: false, message: 'Order not found' });
//     }

//     // Update order based on payment status
//     if (status === 'Success') {
//       order.paymentStatus = 'Paid';
//       order.orderStatus = 'Confirmed';
//     } else if (status === 'Failed') {
//       order.paymentStatus = 'Failed';
//       order.orderStatus = 'Payment Failed';
//     }

//     // Save the updated order
//     await order.save();

//     // Respond to the client
//     res.json({ success: true, message: 'Order placed successfully' });
//   } catch (error) {
//     console.error('Error processing payment response:', error);
//     res.status(500).json({ success: false, message: 'Error processing payment response' });
//   }
// },

// noo nweee
// onlineOrderPlacing :   async (req, res) => {
//   console.log('Received request body:', req.body);

//   const { order_id, payment_id, signature, status } = req.body;
//   const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

//   const paymentResponse = {
//       order_id,
//       payment_id,
//       signature
//   };

//   console.log('Payment response:', paymentResponse);
//   console.log('Razorpay secret:', razorpaySecret);

//   const isSignatureValid = verifyPaymentSignature(paymentResponse, razorpaySecret);
//   console.log('Is signature valid:', isSignatureValid);

//   if (!isSignatureValid) {
//       return res.status(400).json({ success: false, message: 'Invalid payment signature' });
//   }

//   try {
//       const order = await Order.findOne({ razorpay_order_id: order_id });
//       console.log('Found order:', order);

//       if (!order) {
//           return res.status(404).json({ success: false, message: 'Order not found' });
//       }

//       if (status === 'Success') {
//           order.paymentStatus = 'Paid';
//           order.orderStatus = 'Confirmed';
//       } else if (status === 'Failed') {
//           order.paymentStatus = 'Failed';
//           order.orderStatus = 'Payment Failed';
//       }

//       await order.save();
//       res.json({ success: true, message: 'Order placed successfully' });
//   } catch (error) {
//       console.error('Error processing payment response:', error);
//       res.status(500).json({ success: false, message: 'Error processing payment response' });
//   }
// },


// onlineOrderPlacing : async (req, res) => {
//   try {
//     const userId = req.session.user.id;

//     const cart = await Cart.findOne({ userId }).populate("product.productId");

//     if (!cart || !cart.product.length) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }
//     const orderId = uuidv4();

//     const user = await User.findById(userId);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     const { addressIndex, status, totalAmount, paymentMethod } = req.query;

//     const { couponId, subtotal } = req.body;

//     const selectedAddress = user.address[addressIndex];

//     let couponAmount = 0;
//     let couponCode = 0;
//     if (couponId) {
//       const coupon = await Coupon.findById(couponId);
//       couponAmount = (parseInt(subtotal) * coupon.discountamount) / 100;
//       couponCode = coupon.couponcode;
//     }

//     const newOrder = new Order({
//       orderId,
//       user: userId,
//       items: cart.product.map((item) => ({
//         productId: item.productId._id,
//         title: item.productId.title,
//         image: item.productId.image,
//         productPrice:
//           item.productId.discountPrice > 0
//             ? item.productId.discountPrice
//             : item.productId.price,
//         quantity: item.quantity,
//         price:
//           item.productId.discountPrice > 0
//             ? item.productId.discountPrice * item.quantity
//             : item.productId.price * item.quantity,
//         status: status === "Success" ? "Confirmed" : "Pending",
//         // Or any default status you prefer
//       })),
//       billTotal: couponId ? parseInt(totalAmount) : parseInt(subtotal),
//       shippingAddress: {
//         houseName: selectedAddress.houseName,
//         street: selectedAddress.street,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         country: selectedAddress.country,
//         postalCode: selectedAddress.postalCode,
//       },
//       paymentMethod,
//       paymentStatus: status,
//       couponAmount,
//       couponCode,
//       couponId,
//     });

//     await newOrder.save();
//     if (newOrder.paymentStatus == "Success") {
//       for (const item of newOrder.items) {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with id ${item.productId} not found`);
//         }
//         product.stock -= item.quantity;
//         await product.save();
//       }

//       await Cart.findOneAndDelete({ userId });

//       res
//         .status(201)
//         .json({ success: true, message: "Order placed successfully" });
//     } else if (newOrder.paymentStatus === "Failed") {
//       await Cart.findOneAndDelete({ userId });
//       res.status(201).json({ success: true, message: "Payment failed retry" });
//     }
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },

// onlineOrderPlacing: async (req, res) => {
//   try {
//     console.log('Received order data:', req.body);

//     const { order_id, payment_id, signature, status } = req.body;

//     console.log('Verifying payment signature...');
//     const isValid = verifyPaymentSignature(
//       { 
//         order_id, 
//         payment_id, 
//         signature 
//       }, 
//       process.env.RAZORPAY_SECRET
//     );

//     console.log('Signature verification result:', isValid);

//     if (!isValid) {
//       console.log('Invalid payment signature');
//       return res.status(400).json({ success: false, message: "Invalid payment signature" });
//     }

//     // Rest of your order processing logic...
//     console.log('Processing order...');

//     // After successful order processing
//     console.log('Order processed successfully');
//     res.status(200).json({ success: true, message: "Order placed successfully" });

//   } catch (error) {
//     console.error('Error in onlineOrderPlacing:', error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },


// last used

// onlineOrderPlacing: async (req, res) => {
//   try {
//     console.log('Received order data:', req.body);

//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, status } = req.body;

//     console.log('Verifying payment signature...');
//     const isValid = verifyPaymentSignature(
//       { 
//         order_id: razorpay_order_id, 
//         payment_id: razorpay_payment_id, 
//         signature: razorpay_signature 
//       }, 
//       process.env.RAZORPAY_SECRET
//     );

//     console.log('Signature verification result:', isValid);

//     if (!isValid) {
//       console.log('Invalid payment signature');
//       return res.status(400).json({ success: false, message: "Invalid payment signature" });
//     }

//     // Find the order in the database
//     const order = await Order.findOne({ 'razorpay_order_id': razorpay_order_id });
    
//     if (!order) {
//       console.log('Order not found');
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     // Update order status
//     order.paymentStatus = 'Success';
//     await order.save();

//     console.log('Order updated successfully');
//     res.status(200).json({ success: true, message: "Order placed successfully" });

//   } catch (error) {
//     console.error('Error in onlineOrderPlacing:', error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },

// onlineOrderPlacing : async (req, res) => {
//   try {
//       const { order_id, razorpay_payment_id, razorpay_signature, addressIndex, couponId } = req.body;
//       const userId = req.session.user.id;

//       // Verify payment signature
//       const isSignatureValid = verifyPaymentSignature(order_id, razorpay_payment_id, razorpay_signature);

//       if (!isSignatureValid) {
//           return res.status(400).json({ success: false, message: 'Invalid payment signature' });
//       }

//       // Proceed with placing the order
//       const cart = await Cart.findOne({ userId }).populate('product.productId');
//       const user = await User.findById(userId);
//       const selectedAddress = user.address[addressIndex];

//       // Calculate billTotal
//       let billTotal = 0;
//       cart.product.forEach(item => {
//           billTotal += item.productId.price * item.quantity;
//       });

//       const newOrder = new Order({
//           orderId: order_id,
//           user: userId,
//           items: cart.product.map(item => ({
//               productId: item.productId._id,
//               title: item.productId.name,
//               name: item.productId.name,
//               image: item.productId.image,
//               productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
//               quantity: item.quantity,
//               price: item.productId.discountPrice > 0 ? item.productId.discountPrice * item.quantity : item.productId.price * item.quantity
//           })),
//           total: billTotal,
//           address: selectedAddress,
//           paymentMethod: 'razorpay',
//           paymentStatus: 'paid'
//       });

//       await newOrder.save();
//       res.json({ success: true, message: 'Order placed successfully' });

//   } catch (error) {
//       console.error('Error in onlineOrderPlacing:', error);
//       res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// },

// onlineOrderPlacing : async (req, res) => {
//   try {
    
//     const userId = req.session.user.id;
//     const {addressIndex, paymentMethod, totalAmount, couponcode, subtotal } = req.body;

//     console.log('Received order data:', req.body);

//     const cart = await Cart.findOne({ userId }).populate("product.productId");

//     if (!cart) {
//       console.log('Cart not found for user:', userId);
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     if (!cart.product.length) {
//       console.log('Cart is empty for user:', userId);
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const orderId = uuidv4();
//     const user = await User.findById(userId);

//     if (!user) {
//       console.log('User not found:', userId);
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     let billTotal = subtotal;

//     const selectedAddress = user.address[addressIndex];

//     const newOrder = new Order({
//       orderId,
//       user: userId,
//       items: cart.product.map((item) => ({
//         productId: item.productId._id,
//         name: item.productId.name,
//         image: item.productId.image,
//         productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
//         quantity: item.quantity,
//         price: item.productId.discountPrice > 0 ? item.productId.discountPrice * item.quantity : item.productId.price * item.quantity,
//       })),
//       billTotal: billTotal,
//       shippingAddress: {
//         houseName: selectedAddress.houseName,
//         street: selectedAddress.street,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         country: selectedAddress.country,
//         postalCode: selectedAddress.postalCode,
//       },
//       paymentMethod,
//       paymentStatus: 'Pending',
//       orderStatus: 'Pending',
//       couponAmount: couponcode ? calculateCouponDiscount(couponcode, billTotal) : 0,
//       couponCode: couponcode || '',
//     });

//     await newOrder.save();

//     if (paymentMethod === 'razorpay') {
//       const options = {
//         amount: billTotal * 100, // amount in the smallest currency unit
//         currency: "INR",
//         receipt: orderId
//       };

//       const razorpayOrder = await razorpayInstance.orders.create(options);
//       console.log("Razorpay order created:", razorpayOrder);

//       res.status(201).json({ success: true, message: "Order placed successfully", orderId: razorpayOrder.id });
//     } else {
//       res.status(400).json({ success: false, message: "Invalid payment method" });
//     }
//   } catch (error) {
//     console.error("Error in onlineOrderPlacing:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },

// onlineOrderPlacing : async (req, res) => {
//   try {
//     const userId = req.session.user && req.session.user.id;

//     if (!userId) {
//       return res.status(400).json({ success: false, message: "User not logged in" });
//     }

//     const cart = await Cart.findOne({ userId }).populate('product.productId');

//     if (!cart || !cart.product.length) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const orderId = uuidv4();

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const { addressIndex, status, totalAmount, paymentMethod } = req.query;
//     const { couponId, subtotal } = req.body;

//     if (addressIndex === undefined || addressIndex < 0 || addressIndex >= user.address.length) {
//       return res.status(400).json({ success: false, message: "Invalid address index" });
//     }

//     const selectedAddress = user.address[addressIndex];

//     let couponAmount = 0;
//     let couponCode = '';
//     if (couponId) {
//       const coupon = await Coupon.findById(couponId);
//       if (coupon) {
//         couponAmount = (parseInt(subtotal) * coupon.discountamount) / 100;
//         couponCode = coupon.couponcode;
//       }
//     }

//     const newOrder = new Order({
//       orderId,
//       user: userId,
//       items: cart.product.map((item) => ({
//         productId: item.productId._id,
//         title: item.productId.title,
//         image: item.productId.image,
//         productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
//         quantity: item.quantity,
//         price: item.productId.discountPrice > 0 ? item.productId.discountPrice * item.quantity : item.productId.price * item.quantity,
//         status: status === "Success" ? "Confirmed" : "Pending",
//       })),
//       billTotal: couponId ? parseInt(totalAmount) : parseInt(subtotal),
//       shippingAddress: {
//         houseName: selectedAddress.houseName,
//         street: selectedAddress.street,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         country: selectedAddress.country,
//         postalCode: selectedAddress.postalCode,
//       },
//       paymentMethod,
//       paymentStatus: status,
//       couponAmount,
//       couponCode,
//       couponId,
//     });

//     await newOrder.save();

//     if (newOrder.paymentStatus === "Success") {
//       for (const item of newOrder.items) {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with id ${item.productId} not found`);
//         }
//         product.stock -= item.quantity;
//         await product.save();
//       }

//       await Cart.findOneAndDelete({ userId });

//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } else if (newOrder.paymentStatus === "Failed") {
//       await Cart.findOneAndDelete({ userId });
//       res.status(201).json({ success: true, message: "Payment failed, please retry" });
//     }
//   } catch (error) {
//     console.error("Error in onlineOrderPlacing:", error.message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },





// createRazorpayOrder : async(req, res)=> {
//   try {
//     const { totalAmount, receipt } = req.body;

//     // Ensure receipt is no longer than 40 characters
//     const truncatedReceipt = receipt.substring(0, 40);

//     const orderOptions = {
//       amount: totalAmount * 100, // Convert to paise
//       currency: 'INR',
//       receipt: truncatedReceipt
//     };

//     const order = await razorpayInstance.orders.create(orderOptions);
//     res.json({ success: true, order });
//   } catch (error) {
//     console.error('Razorpay error:', error);
//     res.status(500).json({ success: false, message: 'Error creating Razorpay order' });
//   }
// },




// placeOrder : async (req, res) => {
//   console.log("placeOrder function called");
//   try {
//     const userId = req.session.user.id;
//     console.log("User ID:", userId);

//     const cart = await Cart.findOne({ userId }).populate("product.productId");
//     if (!cart || !cart.product.length) {
//       console.log("Cart is empty for user:", userId);
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const orderId = uuidv4();
//     const user = await User.findById(userId);
//     if (!user) {
//       console.log("User not found for ID:", userId);
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const { addressIndex, paymentMethod, totalAmount, couponcode } = req.body;
//     let { subtotal } = req.body;
//     const { status } = req.query;

//     console.log("Received values:", { addressIndex, paymentMethod, totalAmount, couponcode, subtotal });

//     if (!subtotal || isNaN(parseFloat(subtotal))) {
//       subtotal = cart.product.reduce((acc, item) => {
//         const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//         return acc + price * item.quantity;
//       }, 0);
//       console.log("Calculated subtotal:", subtotal);
//     }

//     if (!subtotal || isNaN(parseFloat(subtotal))) {
//       console.log("Invalid subtotal after calculation:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid subtotal" });
//     }

//     const selectedAddress = user.address[addressIndex];
//     if (!selectedAddress) {
//       console.log("Invalid address index:", addressIndex);
//       return res.status(400).json({ success: false, message: "Invalid address" });
//     }

//     let couponAmount = 0;
//     let coupon = null;
//     if (couponcode) {
//       coupon = await Coupon.findOne({ couponcode });
//       if (coupon) {
//         couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//         console.log("Coupon applied:", couponcode, "Discount amount:", couponAmount);
//       } else {
//         console.log("Invalid coupon code:", couponcode);
//       }
//     }

//     const items = cart.product.map((item) => {
//       if (!item.productId.name) {
//         throw new Error('Product name is missing');
//       }
//       const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//       return {
//         productId: item.productId._id,
//         name: item.productId.name,
//         image: item.productId.image,
//         productPrice: price,
//         quantity: item.quantity,
//         price: price * item.quantity,
//         status: paymentMethod === "razorpay" && status === "Success" ? "Confirmed" : "Pending",
//       };
//     });

//     const billTotal = coupon ? parseFloat(totalAmount) : parseFloat(subtotal);
//     if (isNaN(billTotal)) {
//       console.log("Invalid total amount:", totalAmount, "or subtotal:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid total amount" });
//     }

//     const newOrder = new Order({
//       orderId,
//       user: userId,
//       items,
//       billTotal,
//       shippingAddress: {
//         houseName: selectedAddress.houseName,
//         street: selectedAddress.street,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         country: selectedAddress.country,
//         postalCode: selectedAddress.postalCode,
//       },
//       paymentMethod,
//       paymentStatus: status || "Pending",
//       couponAmount,
//       couponCode: coupon ? coupon.couponcode : "",
//       couponId: coupon ? coupon._id : null,
//     });

//     console.log("New order created:", newOrder);

//     if (paymentMethod === "razorpay") {
//       const receipt = `receipt_${orderId}`.substring(0, 40);
//       const options = {
//         amount: Math.round(parseFloat(totalAmount) * 100),
//         currency: "INR",
//         receipt: receipt,
//       };

//       razorpayInstance.orders.create(options, async (err, order) => {
//         if (err) {
//           console.error("Razorpay error:", err);
//           return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
//         }

//         newOrder.razorpayOrderId = order.id;
//         await newOrder.save();
//         console.log("Razorpay order created:", order.id);
//         res.status(200).json({
//           success: true,
//           message: "Order Created",
//           order_id: order.id,
//           amount: Math.round(totalAmount * 100),
//           key_id: process.env.RAZOR_PAY_KEY,
//           product_name: "Order Items",
//           description: "Purchase from our store",
//           contact: user.phone || "",
//           name: user.name,
//           email: user.email,
//         });
//       });
//     } else if (paymentMethod === "Cash On Delivery") {
//       await newOrder.save();
//       console.log("Order placed with Cash On Delivery");

//       for (const item of newOrder.items) {
//         await Product.findByIdAndUpdate(item.productId, {
//           $inc: { stock: -item.quantity }
//         });
//       }

//       await Cart.findOneAndDelete({ userId });
//       console.log("Cart cleared for user:", userId);

//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } else {
//       res.status(400).json({ success: false, message: "Invalid payment method" });
//     }

//     if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Success") {
//       for (const item of newOrder.items) {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with id ${item.productId} not found`);
//         }
//         product.stock -= item.quantity;
//         await product.save();
//         console.log("Product stock updated:", product._id); 
//       }

//       await Cart.findOneAndDelete({ userId });
//       console.log("Cart cleared for user:", userId);
//     } else if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Failed") {
//       await Cart.findOneAndDelete({ userId });
//       res.status(201).json({ success: true, message: "Payment failed, retry" });
//     }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },


// nww
// placeOrder: async (req, res) => {
//   console.log("placeOrder function called");
//   try {
//     const userId = req.session.user.id;
//     console.log("User ID:", userId);

//     const cart = await Cart.findOne({ userId }).populate("product.productId");
//     if (!cart || !cart.product.length) {
//       console.log("Cart is empty for user:", userId);
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const orderId = uuidv4();
//     const user = await User.findById(userId);
//     if (!user) {
//       console.log("User not found for ID:", userId);
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     if (!user.address || user.address.length === 0) {
//       console.log("User has no saved addresses");
//       return res.status(400).json({ success: false, message: "No saved addresses found" });
//     }

//     const { addressIndex, paymentMethod, totalAmount, couponcode } = req.body;
//     let { subtotal } = req.body;
//     const { status } = req.query;

//     console.log("Received values:", { addressIndex, paymentMethod, totalAmount, couponcode, subtotal });

//     if (!subtotal || isNaN(parseFloat(subtotal))) {
//       subtotal = cart.product.reduce((acc, item) => {
//         const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//         return acc + price * item.quantity;
//       }, 0);
//       console.log("Calculated subtotal:", subtotal);
//     }

//     if (!subtotal || isNaN(parseFloat(subtotal))) {
//       console.log("Invalid subtotal after calculation:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid subtotal" });
//     }

//     if (addressIndex === undefined || addressIndex < 0 || addressIndex >= user.address.length) {
//       console.log("Invalid address index:", addressIndex);
//       return res.status(400).json({ success: false, message: "Invalid address index" });
//     }

//     const selectedAddress = user.address[addressIndex];
//     if (!selectedAddress) {
//       console.log("Selected address is undefined for index:", addressIndex);
//       return res.status(400).json({ success: false, message: "Invalid address" });
//     }

//     console.log("Selected address:", selectedAddress);

//     let couponAmount = 0;
//     let coupon = null;
//     if (couponcode) {
//       coupon = await Coupon.findOne({ couponcode });
//       if (coupon) {
//         couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//         console.log("Coupon applied:", couponcode, "Discount amount:", couponAmount);
//       } else {
//         console.log("Invalid coupon code:", couponcode);
//       }
//     }

//     const items = cart.product.map((item) => {
//       if (!item.productId.name) {
//         throw new Error('Product name is missing');
//       }
//       const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//       return {
//         productId: item.productId._id,
//         name: item.productId.name,
//         image: item.productId.image,
//         productPrice: price,
//         quantity: item.quantity,
//         price: price * item.quantity,
//         status: paymentMethod === "razorpay" && status === "Success" ? "Confirmed" : "Pending",
//       };
//     });

//     const billTotal = coupon ? parseFloat(totalAmount) : parseFloat(subtotal);
//     if (isNaN(billTotal)) {
//       console.log("Invalid total amount:", totalAmount, "or subtotal:", subtotal);
//       return res.status(400).json({ success: false, message: "Invalid total amount" });
//     }

//     const newOrder = new Order({
//       orderId,
//       user: userId,
//       items,
//       billTotal,
//       shippingAddress: {
//         houseName: selectedAddress.houseName,
//         street: selectedAddress.street,
//         city: selectedAddress.city,
//         state: selectedAddress.state,
//         country: selectedAddress.country,
//         postalCode: selectedAddress.postalCode,
//       },
//       paymentMethod,
//       paymentStatus: status || "Pending",
//       couponAmount,
//       couponCode: coupon ? coupon.couponcode : "",
//       couponId: coupon ? coupon._id : null,
//     });

//     console.log("New order created:", newOrder);

//     if (paymentMethod === "razorpay") {
//       const receipt = `receipt_${orderId}`.substring(0, 40);
//       const options = {
//         amount: Math.round(parseFloat(totalAmount) * 100),
//         currency: "INR",
//         receipt: receipt,
//       };

//       razorpayInstance.orders.create(options, async (err, order) => {
//         if (err) {
//           console.error("Razorpay error:", err);
//           return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
//         }

//         newOrder.razorpayOrderId = order.id;
//         await newOrder.save();
//         console.log("Razorpay order created:", order.id);
//         res.status(200).json({
//           success: true,
//           message: "Order Created",
//           order_id: order.id,
//           amount: Math.round(totalAmount * 100),
//           key_id: process.env.RAZOR_PAY_KEY,
//           product_name: "Order Items",
//           description: "Purchase from our store",
//           contact: user.phone || "",
//           name: user.name,
//           email: user.email,
//         });
//       });
//     } else if (paymentMethod === "Cash On Delivery") {
//       await newOrder.save();
//       console.log("Order placed with Cash On Delivery");

//       for (const item of newOrder.items) {
//         await Product.findByIdAndUpdate(item.productId, {
//           $inc: { stock: -item.quantity }
//         });
//       }

//       await Cart.findOneAndDelete({ userId });
//       console.log("Cart cleared for user:", userId);

//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } else {
//       res.status(400).json({ success: false, message: "Invalid payment method" });
//     }

//     if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Success") {
//       for (const item of newOrder.items) {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with id ${item.productId} not found`);
//         }
//         product.stock -= item.quantity;
//         await product.save();
//         console.log("Product stock updated:", product._id); 
//       }

//       await Cart.findOneAndDelete({ userId });
//       console.log("Cart cleared for user:", userId);
//     } else if (paymentMethod !== "Cash On Delivery" && newOrder.paymentStatus === "Failed") {
//       await Cart.findOneAndDelete({ userId });
//       res.status(201).json({ success: true, message: "Payment failed, retry" });
//     }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },