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
// const crypto = require('crypto');
const crypto = require("crypto");

const dotenv = require('dotenv');
dotenv.config();


const PDFDocument = require("pdfkit-table");
const { verifyPaymentSignature } = require('./razorpayUtils');



// const { verifyPaymentSignature } = require('./razorpayUtils'); // Adjust the path as necessary

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const orderManagement = {

// wrking code
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

//     // Ensure addressIndex is a valid integer
//     if (addressIndex === undefined || isNaN(parseInt(addressIndex)) || addressIndex < 0 || addressIndex >= user.address.length) {
//       console.log("Invalid address index:", addressIndex);
//       return res.status(400).json({ success: false, message: "Invalid address index" });
//     }

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

//     const selectedAddress = user.address[parseInt(addressIndex)];
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

// placeOrder : async (req, res) => {
//   console.log("placeOrder function called");
//   try {
//       const userId = req.session.user.id;
//       console.log("User ID:", userId);

//       const cart = await Cart.findOne({ userId }).populate("product.productId");
//       if (!cart || !cart.product.length) {
//           console.log("Cart is empty for user:", userId);
//           return res.status(400).json({ success: false, message: "Cart is empty" });
//       }

//       const user = await User.findById(userId);
//       if (!user) {
//           console.log("User not found for ID:", userId);
//           return res.status(404).json({ success: false, message: "User not found" });
//       }

//       if (!user.address || user.address.length === 0) {
//           console.log("User has no saved addresses");
//           return res.status(400).json({ success: false, message: "No saved addresses found" });
//       }

//       const { addressIndex, paymentMethod, totalAmount, couponcode } = req.body;
//       let { subtotal } = req.body;

//       console.log("Received values:", { addressIndex, paymentMethod, totalAmount, couponcode, subtotal });

//       if (addressIndex === undefined || isNaN(parseInt(addressIndex)) || addressIndex < 0 || addressIndex >= user.address.length) {
//           console.log("Invalid address index:", addressIndex);
//           return res.status(400).json({ success: false, message: "Invalid address index" });
//       }

//       if (!subtotal || isNaN(parseFloat(subtotal))) {
//           subtotal = cart.product.reduce((acc, item) => {
//               const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//               return acc + price * item.quantity;
//           }, 0);
//           console.log("Calculated subtotal:", subtotal);
//       }

//       if (!subtotal || isNaN(parseFloat(subtotal))) {
//           console.log("Invalid subtotal after calculation:", subtotal);
//           return res.status(400).json({ success: false, message: "Invalid subtotal" });
//       }

//       const selectedAddress = user.address[parseInt(addressIndex)];
//       if (!selectedAddress) {
//           console.log("Selected address is undefined for index:", addressIndex);
//           return res.status(400).json({ success: false, message: "Invalid address" });
//       }

//       console.log("Selected address:", selectedAddress);

//       let couponAmount = 0;
//       if (couponcode) {
//           const coupon = await Coupon.findOne({ couponcode });
//           if (coupon) {
//               couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//               console.log("Coupon applied:", couponcode, "Discount amount:", couponAmount);
//           } else {
//               console.log("Invalid coupon code:", couponcode);
//           }
//       }

//       const items = cart.product.map((item) => {
//           const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//           return {
//               productId: item.productId._id,
//               name: item.productId.name,
//               image: item.productId.image,
//               productPrice: price,
//               quantity: item.quantity,
//               price: price * item.quantity,
//               status: paymentMethod === "razorpay" ? "Pending" : "Confirmed", // COD should have Confirmed status
//           };
//       });

//       const billTotal = coupon ? parseFloat(totalAmount) : parseFloat(subtotal);
//       if (isNaN(billTotal)) {
//           console.log("Invalid total amount:", totalAmount, "or subtotal:", subtotal);
//           return res.status(400).json({ success: false, message: "Invalid total amount" });
//       }

//       const newOrder = new Order({
//           orderId: uuidv4(),
//           user: userId,
//           items,
//           billTotal,
//           shippingAddress: {
//               houseName: selectedAddress.houseName,
//               street: selectedAddress.street,
//               city: selectedAddress.city,
//               state: selectedAddress.state,
//               country: selectedAddress.country,
//               postalCode: selectedAddress.postalCode,
//           },
//           paymentMethod,
//           paymentStatus: paymentMethod === "Cash On Delivery" ? "Pending" : "Success",
//           couponAmount,
//           couponCode: couponcode || "",
//           couponId: coupon ? coupon._id : null,
//       });

//       console.log("New order created:", newOrder);

//       if (paymentMethod === "razorpay") {
//           // Razorpay specific code...
//       } else if (paymentMethod === "Cash On Delivery") {
//           await newOrder.save();
//           console.log("Order placed with Cash On Delivery");

//           for (const item of newOrder.items) {
//               await Product.findByIdAndUpdate(item.productId, {
//                   $inc: { stock: -item.quantity }
//               });
//           }

//           await Cart.findOneAndDelete({ userId });
//           console.log("Cart cleared for user:", userId);

//           res.status(201).json({ success: true, message: "Order placed successfully" });
//       } else {
//           res.status(400).json({ success: false, message: "Invalid payment method" });
//       }
//   } catch (error) {
//       console.error("Error placing order:", error);
//       res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },


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

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found for ID:", userId);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.address || user.address.length === 0) {
      console.log("User has no saved addresses");
      return res.status(400).json({ success: false, message: "No saved addresses found" });
    }

    const { addressIndex, paymentMethod, totalAmount, couponcode } = req.body;
    let { subtotal } = req.body;

    console.log("Received values:", { addressIndex, paymentMethod, totalAmount, couponcode, subtotal });

    if (addressIndex === undefined || isNaN(parseInt(addressIndex)) || addressIndex < 0 || addressIndex >= user.address.length) {
      console.log("Invalid address index:", addressIndex);
      return res.status(400).json({ success: false, message: "Invalid address index" });
    }

    if (!subtotal || isNaN(parseFloat(subtotal))) {
      subtotal = cart.product.reduce((acc, item) => {
        const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
        return acc + price * item.quantity;
      }, 0);
      console.log("Calculated subtotal:", subtotal);
    }

    if (!subtotal || isNaN(parseFloat(subtotal))) {
      console.log("Invalid subtotal after calculation:", subtotal);
      return res.status(400).json({ success: false, message: "Invalid subtotal" });
    }

    const selectedAddress = user.address[parseInt(addressIndex)];
    if (!selectedAddress) {
      console.log("Selected address is undefined for index:", addressIndex);
      return res.status(400).json({ success: false, message: "Invalid address" });
    }

    console.log("Selected address:", selectedAddress);

    let couponAmount = 0;
    if (couponcode) {
      const coupon = await Coupon.findOne({ couponcode });
      if (coupon) {
        couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
        console.log("Coupon applied:", couponcode, "Discount amount:", couponAmount);
      } else {
        console.log("Invalid coupon code:", couponcode);
      }
    }

    const items = cart.product.map((item) => {
      const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
      return {
        productId: item.productId._id,
        name: item.productId.name,
        image: item.productId.image,
        productPrice: price,
        quantity: item.quantity,
        price: price * item.quantity,
        status: paymentMethod === "Cash On Delivery" ? "Confirmed" : "Pending",
      };
    });

    const billTotal = coupon ? parseFloat(totalAmount) : parseFloat(subtotal);
    if (isNaN(billTotal)) {
      console.log("Invalid total amount:", totalAmount, "or subtotal:", subtotal);
      return res.status(400).json({ success: false, message: "Invalid total amount" });
    }

    const newOrder = new Order({
      orderId: uuidv4(),
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
      paymentStatus: paymentMethod === "Cash On Delivery" ? "Pending" : "Success",
      couponAmount,
      couponCode: couponcode || "",
      couponId: coupon ? coupon._id : null,
    });

    console.log("New order created:", newOrder);

    if (paymentMethod === "Cash On Delivery") {
      await newOrder.save();
      console.log("Order placed with Cash On Delivery");

      // Update product stock
      for (const item of newOrder.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
      }

      // Clear the cart
      await Cart.findOneAndDelete({ userId });
      console.log("Cart cleared for user:", userId);

      res.status(201).json({ success: true, message: "Order placed successfully" });
    } else {
      // Handle Razorpay or other payment methods here
      res.status(400).json({ success: false, message: "Invalid payment method" });
    }
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
},







onlineOrderPlacing: async (req, res) => {
  try {
    const userId = req.session.user && req.session.user.id;
    if (!userId) {
      console.log("User not logged in");
      return res.status(400).json({ success: false, message: "User not logged in" });
    }

    console.log("Request query:", req.query);
    console.log("Request body:", req.body);

    const { status, razorpay_order_id } = req.body;

    console.log("Parsed values:", { status, razorpay_order_id });

    let existingOrder;

    if (razorpay_order_id) {
      existingOrder = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    } else {
      console.log("Razorpay order ID is missing, fetching most recent pending order");
      existingOrder = await Order.findOne({ 
        user: userId, 
        paymentStatus: 'Pending',
        paymentMethod: 'razorpay'
      }).sort({ orderDate: -1 });
    }

    if (!existingOrder) {
      console.log("Order not found");
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    console.log("Existing order:", existingOrder);

    // Update the order status
    existingOrder.paymentStatus = status;
    if (status === "Success") {
      existingOrder.orderStatus = "Confirmed";
      existingOrder.items.forEach(item => {
        item.status = "Confirmed";
      });
    } else if (status === "Failed") {
      existingOrder.orderStatus = "Failed";
    }

    await existingOrder.save();
    console.log("Order updated successfully:", existingOrder);

    if (status === "Success") {
      for (const item of existingOrder.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product with id ${item.productId} not found`);
        }
        product.stock -= item.quantity;
        await product.save();
        console.log("Product stock updated:", product._id); 
      }

      await Cart.findOneAndDelete({ user: userId });
      console.log("Cart cleared for user:", userId);
    }

    res.status(200).json({ success: true, message: `Order ${status.toLowerCase()}` });
  } catch (error) {
    console.error("Error in onlineOrderPlacing:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
},

















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



  // checkWalletBalance: async (req, res) => {
  //   try {
  //     const userId = req.session.user.id;
  //     const totalAmount = parseFloat(req.query.totalAmount);

  //     const wallet = await Wallet.findOne({ user: userId });

  //     if (!wallet) {
  //       return res
  //         .status(404)
  //         .json({ success: false, message: "Wallet not found" });
  //     }

  //     if (wallet.walletBalance >= totalAmount) {
  //       res.json({ success: true });
  //     } else {
  //       res.json({ success: false, message: "Insufficient wallet balance" });
  //     }
  //   } catch (error) {
  //     console.log("Error checking wallet", error.message);
  //     res.status(500).json({ success: false, message: "Internal server error" });
  //   }
  // },




  // nw
//   checkWalletBalance : async (req, res) => {
//     try {
//         const userId = req.session.user.id;
//         const totalAmount = parseFloat(req.query.totalAmount);

//         if (isNaN(totalAmount)) {
//             return res.status(400).json({ success: false, message: "Invalid total amount" });
//         }

//         const wallet = await Wallet.findOne({ user: userId });

//         if (!wallet) {
//             return res.status(404).json({ success: false, message: "Wallet not found" });
//         }

//         res.json({
//             success: true,
//             walletBalance: wallet.walletBalance
//         });
//     } catch (error) {
//         console.error("Error checking wallet balance:", error.message);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// },



checkWalletBalance: async (req, res) => {
  try {
      const userId = req.session.user.id;
      console.log("User ID from session:", userId); // Debug log

      // Parse totalAmount from query string
      const totalAmount = parseFloat(req.query.totalAmount);
      console.log("Total amount:", totalAmount); // Debug log

      // Validate totalAmount
      if (isNaN(totalAmount)) {
          return res.status(400).json({ success: false, message: "Invalid total amount" });
      }

      // Fetch wallet information
      const wallet = await Wallet.findOne({ user: userId });
      console.log("Wallet retrieved:", wallet); // Debug log

      // Handle case where wallet is not found
      if (!wallet) {
          return res.status(404).json({ success: false, message: "Wallet not found" });
      }

      // Respond with wallet balance
      res.json({
          success: true,
          walletBalance: wallet.walletBalance
      });
  } catch (error) {
      console.error("Error checking wallet balance:", error.message);
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
