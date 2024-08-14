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
const walletModel = require("../model/walletModel");



// const { verifyPaymentSignature } = require('./razorpayUtils'); // Adjust the path as necessary

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const orderManagement = {






// working code

// placeOrder: async (req, res) => {
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

//       const { addressIndex, paymentMethod, totalAmount, couponcode, couponId } = req.body;
//       let { subtotal } = req.body;

//       console.log("Received values:", { addressIndex, paymentMethod, totalAmount, couponcode, couponId,subtotal });

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
//       const coupon = null;
//       let couponAmount = 0;
//       let billTotal = subtotal;

//       if (couponId) {
//           const coupon = await Coupon.findById(couponId);
//           if (coupon) {
//               couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//               billTotal = parseFloat(subtotal) - coupon.discountamount;
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
//               status: paymentMethod === "Cash On Delivery" ? "Confirmed" : "Pending",
//           };
//       });
//      console.log("Coupon" + coupon)
//       console.log("billTotal" + billTotal)

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

//       if (paymentMethod === "Cash On Delivery") {
//           await newOrder.save();
//           console.log("Order placed with Cash On Delivery");

//           // Update product stock
//           for (const item of newOrder.items) {
//               await Product.findByIdAndUpdate(item.productId, {
//                   $inc: { stock: -item.quantity }
//               });
//           }

//           // Clear the cart
//           await Cart.findOneAndDelete({ userId });
//           console.log("Cart cleared for user:", userId);

//           res.status(201).json({ success: true, message: "Order placed successfully" });
//       } else if (paymentMethod === "razorpay") {
//           const razorpayOrder = await razorpayInstance.orders.create({
//               amount: billTotal * 100, // amount in smallest currency unit
//               currency: "INR",
//               receipt: newOrder.orderId,
//               payment_capture: 1
//           });

//           console.log("Razorpay order created:", razorpayOrder);

//           res.status(201).json({
//               success: true,
//               key_id: process.env.RAZORPAY_KEY_ID,
//               amount: razorpayOrder.amount,
//               currency: razorpayOrder.currency,
//               name: "Books Kart",
//               description: "Purchase from our store",
//               order_id: razorpayOrder.id,
//               contact: user.phone || "",
//               name: user.name || "",
//               email: user.email || "",
//               receipt: razorpayOrder.receipt
//           });
//       } 
//       else if (paymentMethod === "wallet") {
//         const walletBalance = user.wallet ? user.wallet.balance : 0;
//         if (walletBalance >= newOrder.billTotal) {
//           user.wallet.balance -= newOrder.billTotal;
//           user.wallet.transactions.push({
//             amount: newOrder.billTotal,
//             orderId : uuidv4(),
//             description: 'Wallet Transaction',
//             type: "Debit",
//             transactionDate: new Date(),
//           });
//           console.log("Wallet balance updated:", user.wallet.balance);
//           console.log("Wallet transactions:", user.wallet.transactions);

//           await newOrder.save();
//           await user.save();
//           await Cart.findOneAndDelete({ userId });
//           res.status(201).json({ success: true, message: "Order placed successfully" });    
//         } else {
//           res.status(400).json({ success: false, message: "Insufficient wallet balance" });
//         }
//       }else {
//         res.status(400).json({ success: false, message: "Invalid payment method" });
//       }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },


// new try

// placeOrder: async (req, res) => {
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

//       const { addressIndex, paymentMethod, totalAmount, couponcode, couponId } = req.body;
//       let { subtotal } = req.body;

//       console.log("Received values:", { addressIndex, paymentMethod, totalAmount, couponcode, couponId,subtotal });

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
//       const coupon = null;
//       let couponAmount = 0;
//       let billTotal = subtotal;

//       if (couponId) {
//           const coupon = await Coupon.findById(couponId);
//           if (coupon) {
//               couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//               billTotal = parseFloat(subtotal) - couponAmount;
//               console.log("billTotal" , billTotal);
              
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
//               status: paymentMethod === "Cash On Delivery" ? "Confirmed" : "Pending",
//           };
//       });
//      console.log("Coupon" + coupon)
//       console.log("billTotal" + billTotal)

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

//       if (paymentMethod === "Cash On Delivery") {
//           await newOrder.save();
//           console.log("Order placed with Cash On Delivery");

//           // Update product stock
//           for (const item of newOrder.items) {
//               await Product.findByIdAndUpdate(item.productId, {
//                   $inc: { stock: -item.quantity }
//               });
//           }

//           // Clear the cart
//           await Cart.findOneAndDelete({ userId });
//           console.log("Cart cleared for user:", userId);

//           res.status(201).json({ success: true, message: "Order placed successfully" });
//       } else if (paymentMethod === "razorpay") {
//           const razorpayOrder = await razorpayInstance.orders.create({
//               amount: billTotal * 100, // amount in smallest currency unit
//               currency: "INR",
//               receipt: newOrder.orderId,
//               payment_capture: 1
//           });

//           console.log("Razorpay order created:", razorpayOrder);

//           res.status(201).json({
//               success: true,
//               key_id: process.env.RAZORPAY_KEY_ID,
//               amount: razorpayOrder.amount,
//               currency: razorpayOrder.currency,
//               name: "Books Kart",
//               description: "Purchase from our store",
//               order_id: razorpayOrder.id,
//               contact: user.phone || "",
//               name: user.name || "",
//               email: user.email || "",
//               receipt: razorpayOrder.receipt
//           });
//       } 
//       else if (paymentMethod === "wallet") {
//         const walletBalance = user.wallet ? user.wallet.balance : 0;
//         if (walletBalance >= newOrder.billTotal) {
//           user.wallet.balance -= newOrder.billTotal;
//           user.wallet.transactions.push({
//             amount: newOrder.billTotal,
//             orderId : uuidv4(),
//             description: 'Wallet Transaction',
//             type: "Debit",
//             transactionDate: new Date(),
//           });
//           console.log("Wallet balance updated:", user.wallet.balance);
//           console.log("Wallet transactions:", user.wallet.transactions);

//           await newOrder.save();
//           await user.save();
//           await Cart.findOneAndDelete({ userId });
//           res.status(201).json({ success: true, message: "Order placed successfully" });    
//         } else {
//           res.status(400).json({ success: false, message: "Insufficient wallet balance" });
//         }
//       }else {
//         res.status(400).json({ success: false, message: "Invalid payment method" });
//       }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },

// wrking nw
placeOrder: async (req, res) => {
  console.log("placeOrder function called");
  try {
    const userId = req.session.user.id;
    console.log("User ID:", userId);

    // Fetch cart and user data
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

    const { addressIndex, paymentMethod, totalAmount, couponcode, couponId } = req.body;
    let { subtotal } = req.body;
    console.log("Received values:", { addressIndex, paymentMethod, totalAmount, couponcode, couponId, subtotal });

    // Validate address index
    if (addressIndex === undefined || isNaN(parseInt(addressIndex)) || addressIndex < 0 || addressIndex >= user.address.length) {
      console.log("Invalid address index:", addressIndex);
      return res.status(400).json({ success: false, message: "Invalid address index" });
    }

    // Calculate subtotal if not provided
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
    console.log("Selected address:", selectedAddress);

    // Handle coupon application
    
    // let couponAmount = 0;
    // let billTotal = subtotal;

    // if (couponId) {
    //    coupon = await Coupon.findById(couponId);
    //   if (coupon) {
    //     couponAmount = (subtotal * coupon.discountamount) / 100;
    //     billTotal = subtotal - couponAmount;
    //     console.log("Coupon applied:", couponcode, "Discount amount:", couponAmount);
    //   } else {
    //     console.log("Invalid coupon code:", couponcode);
    //   }
    // }

  let coupon = null;
let couponAmount = 0;
let billTotal = subtotal;

if (couponId) {
    coupon = await Coupon.findById(couponId);  // Removed 'const' keyword
    if (coupon) {
        couponAmount = (subtotal * coupon.discountamount) / 100;
        billTotal = subtotal - couponAmount;
        console.log("Coupon applied:", couponcode, "Discount amount:", couponAmount);
    } else {
        console.log("Invalid coupon code:", couponcode);
    }
}







    // Ensure billTotal is valid
    if (isNaN(billTotal)) {
      console.log("Invalid total amount:", totalAmount, "or subtotal:", subtotal);
      return res.status(400).json({ success: false, message: "Invalid total amount" });
    }

    // Prepare order items
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

    // Create new order
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

    // Handle different payment methods
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
    } else if (paymentMethod === "razorpay") {
      const razorpayOrder = await razorpayInstance.orders.create({
        amount: Math.round(billTotal * 100), // amount in smallest currency unit
        currency: "INR",
        receipt: newOrder.orderId,
        payment_capture: 1
      });

      console.log("Razorpay order created:", razorpayOrder);

      res.status(201).json({
        success: true,
        key_id: process.env.RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Books Kart",
        description: "Purchase from our store",
        order_id: razorpayOrder.id,
        contact: user.phone || "",
        name: user.name || "",
        email: user.email || "",
        receipt: razorpayOrder.receipt
      });
    } else if (paymentMethod === "wallet") {
      const walletBalance = user.wallet ? user.wallet.balance : 0;
      if (walletBalance >= billTotal) {
        user.wallet.balance -= billTotal;
        user.wallet.transactions.push({
          amount: billTotal,
          orderId: newOrder.orderId,
          description: 'Wallet Transaction',
          type: "Debit",
          transactionDate: new Date(),
        });
        console.log("Wallet balance updated:", user.wallet.balance);
        console.log("Wallet transactions:", user.wallet.transactions);

        await newOrder.save();
        await user.save();
        await Cart.findOneAndDelete({ userId });
        res.status(201).json({ success: true, message: "Order placed successfully" });    
      } else {
        res.status(400).json({ success: false, message: "Insufficient wallet balance" });
      }
    } else {
      res.status(400).json({ success: false, message: "Invalid payment method" });
    }
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
},

















// wrking code

// onlineOrderPlacing: async (req, res) => {
//   try {
//     console.log("Entering onlineOrderPlacing function");
    
//     const userId = req.session.user && req.session.user.id;
//     if (!userId) {
//       console.log("User not logged in");
//       return res.status(400).json({ success: false, message: "User not logged in" });
//     }
//     console.log("User ID:", userId);

//     const cart = await Cart.findOne({ userId }).populate("product.productId");
//     if (!cart || !cart.product.length) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     console.log("Request body:", req.body);
//     console.log("Request query:", req.query);

//     const { addressIndex, status, totalAmount, paymentMethod } = req.body;
//     const { order_id, payment_id, signature,couponcode, couponId, subtotal } = req.body;

//     // Fallback to the first address if addressIndex is not provided
//     const selectedAddress = addressIndex ? user.address[addressIndex] : user.address[0];

//     // If no address is available, use a placeholder
//     const shippingAddress = selectedAddress ? {
//       houseName: selectedAddress.houseName || 'Not provided',
//       street: selectedAddress.street || 'Not provided',
//       city: selectedAddress.city || 'Not provided',
//       state: selectedAddress.state || 'Not provided',
//       country: selectedAddress.country || 'Not provided',
//       postalCode: selectedAddress.postalCode || 'Not provided',
//     } : {
//       houseName: 'Not provided',
//       street: 'Not provided',
//       city: 'Not provided',
//       state: 'Not provided',
//       country: 'Not provided',
//       postalCode: 'Not provided',
//     };

//     // let couponAmount = 0;
//     // let couponCode = null;
//     // if (couponId) {
//     //   const coupon = await Coupon.findById(couponId);
//     //   if (coupon) {
//     //     couponAmount = (parseInt(subtotal) * coupon.discountamount) / 100;
//     //     couponCode = coupon.couponcode;
//     //   }
//     // }

//     // let billTotal = 0;
//     // for (const item of cart.product) {
//     //   billTotal += item.productId.price * item.quantity;
//     // }

//     const coupon = null;
//       let couponAmount = 0;
//       let billTotal = subtotal;

//       if (couponId) {
//           const coupon = await Coupon.findById(couponId);
//           if (coupon) {
//               couponAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//               billTotal = parseFloat(subtotal) - coupon.discountamount;
//               console.log("Coupon applied:",couponcode, "Discount amount:", couponAmount);
//           } else {
//               console.log("Invalid coupon code: coupon code:", couponcode);
//           }
//       }



//     const newOrder = new Order({
//       orderId: order_id || uuidv4(),
//       user: userId,
//       items: cart.product.map((item) => {
//         if (!item.productId.name) {
//           throw new Error('Item name is required');
//         }
//         return {
//           productId: item.productId._id,
//           name: item.productId.name,
//           image: item.productId.image,
//           productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
//           quantity: item.quantity,
//           price: item.productId.discountPrice > 0
//             ? item.productId.discountPrice * item.quantity
//             : item.productId.price * item.quantity,
//           status: status === "Success" ? "Confirmed" : "Pending",
//           cancellationReason: item.cancellationReason,
//           cancellationDate: item.cancellationDate,
//         };
//       }),
//       billTotal,
//       shippingAddress,
//       paymentMethod: paymentMethod || 'razorpay',
//       paymentStatus: status || 'Pending',
//       couponAmount,
//       couponCode: couponcode || "",
//       couponId: coupon ? coupon._id : null,
//       // couponCode,
//       // couponId,
//       razorpay_Order_Id: order_id,
//       razorpayPaymentId: payment_id,
//       razorpaySignature: signature,
//     });

//     console.log("Attempting to save order");
//     await newOrder.save();
//     console.log("Order saved successfully:", newOrder);

//     if (status === "Success") {
//       console.log("Updating product stock and clearing cart");
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

//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } else {
//       res.status(201).json({ success: true, message: "Payment status not successful" });
//     }

//   } catch (error) {
//     console.error("Error in onlineOrderPlacing:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },

// onlineOrderPlacing: async (req, res) => {
//   try {
//     console.log("Entering onlineOrderPlacing function");
    
//     const userId = req.session.user && req.session.user.id;
//     if (!userId) {
//       console.log("User not logged in");
//       return res.status(400).json({ success: false, message: "User not logged in" });
//     }
//     console.log("User ID:", userId);

//     const cart = await Cart.findOne({ userId }).populate("product.productId");
//     if (!cart || !cart.product.length) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     console.log("Request body:", req.body);
//     console.log("Request query:", req.query);

//     const { addressIndex, status, totalAmount, paymentMethod } = req.body;
//     const { order_id, payment_id, signature, couponId, subtotal } = req.body;

//     // Fallback to the first address if addressIndex is not provided
//     const selectedAddress = addressIndex ? user.address[addressIndex] : user.address[0];

//     // If no address is available, use a placeholder
//     const shippingAddress = selectedAddress ? {
//       houseName: selectedAddress.houseName || 'Not provided',
//       street: selectedAddress.street || 'Not provided',
//       city: selectedAddress.city || 'Not provided',
//       state: selectedAddress.state || 'Not provided',
//       country: selectedAddress.country || 'Not provided',
//       postalCode: selectedAddress.postalCode || 'Not provided',
//     } : {
//       houseName: 'Not provided',
//       street: 'Not provided',
//       city: 'Not provided',
//       state: 'Not provided',
//       country: 'Not provided',
//       postalCode: 'Not provided',
//     };

//     let couponAmount = 0;
//     let couponCode = null;

//     // let billTotal = 0;

//     let billTotal = subtotal;
// if (couponId) {
//     const coupon = await Coupon.findById(couponId);
//     if (coupon) {
//         const discountAmount = (parseFloat(subtotal) * coupon.discountamount) / 100;
//         billTotal = parseFloat(subtotal) - discountAmount;
//     }
// }

// if (isNaN(billTotal)) {
//     billTotal = 0;
// }

    
//     // if (couponId) {
//     //   const coupon = await Coupon.findById(couponId);
//     //   if (coupon) {
//     //     couponAmount = (parseInt(subtotal) * coupon.discountamount) / 100;
//     //     billTotal = parseFloat(subtotal) - couponAmount;
//     //     console.log("billTotal" , billTotal);
//     //     couponCode = coupon.couponcode;

//     //   }
//     // }


//     // let billTotal = 0;
//     // for (const item of cart.product) {
//     //   billTotal += item.productId.price * item.quantity;
//     // }

//     const newOrder = new Order({
//       orderId: order_id || uuidv4(),
//       user: userId,
//       items: cart.product.map((item) => {
//         if (!item.productId.name) {
//           throw new Error('Item name is required');
//         }
//         return {
//           productId: item.productId._id,
//           name: item.productId.name,
//           image: item.productId.image,
//           productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
//           quantity: item.quantity,
//           price: item.productId.discountPrice > 0
//             ? item.productId.discountPrice * item.quantity
//             : item.productId.price * item.quantity,
//           status: status === "Success" ? "Confirmed" : "Pending",
//           cancellationReason: item.cancellationReason,
//           cancellationDate: item.cancellationDate,
//         };
//       }),
//       billTotal,
//       shippingAddress,
//       paymentMethod: paymentMethod || 'razorpay',
//       paymentStatus: status || 'Pending',
//       couponAmount,
//       couponCode,
//       couponId,
//       razorpay_Order_Id: order_id,
//       razorpayPaymentId: payment_id,
//       razorpaySignature: signature,
//     });

//     console.log("Attempting to save order");
//     await newOrder.save();
//     console.log("Order saved successfully:", newOrder);

//     if (status === "Success") {
//       console.log("Updating product stock and clearing cart");
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

//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } else {
//       res.status(201).json({ success: true, message: "Payment status not successful" });
//     }

//   } catch (error) {
//     console.error("Error in onlineOrderPlacing:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },


// last used
// onlineOrderPlacing: async (req, res) => {
//   try {
//     console.log("Entering onlineOrderPlacing function");
    
//     const userId = req.session.user && req.session.user.id;
//     if (!userId) {
//       console.log("User not logged in");
//       return res.status(400).json({ success: false, message: "User not logged in" });
//     }
//     console.log("User ID:", userId);

//     const cart = await Cart.findOne({ userId }).populate("product.productId");
//     if (!cart || !cart.product.length) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     console.log("Request body:", req.body);
//     console.log("Request query:", req.query);

//     const { addressIndex, status, paymentMethod } = req.body;
//     const { order_id, payment_id, signature, couponId } = req.body;

//     // Fallback to the first address if addressIndex is not provided
//     const selectedAddress = addressIndex ? user.address[addressIndex] : user.address[0];

//     // If no address is available, use a placeholder
//     const shippingAddress = selectedAddress ? {
//       houseName: selectedAddress.houseName || 'Not provided',
//       street: selectedAddress.street || 'Not provided',
//       city: selectedAddress.city || 'Not provided',
//       state: selectedAddress.state || 'Not provided',
//       country: selectedAddress.country || 'Not provided',
//       postalCode: selectedAddress.postalCode || 'Not provided',
//     } : {
//       houseName: 'Not provided',
//       street: 'Not provided',
//       city: 'Not provided',
//       state: 'Not provided',
//       country: 'Not provided',
//       postalCode: 'Not provided',
//     };

//     let couponAmount = 0;
//     let couponCode = null;
//     let billTotal = 0;

//     // Calculate the total bill amount
//     for (const item of cart.product) {
//       const productPrice = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//       billTotal += productPrice * item.quantity;
//     }

//     console.log("Bill total:", billTotal);

//     if (couponId) {
//       const coupon = await Coupon.findById(couponId);
//       if (coupon) {
//         const discountAmount = (billTotal * coupon.discountamount) / 100;
//         billTotal -= discountAmount;
//         couponAmount = discountAmount;
//         couponCode = coupon.couponcode;
//       }
//     }

//     console.log("Bill total:", billTotal);

//     const newOrder = new Order({
//       orderId: order_id || uuidv4(),
//       user: userId,
//       items: cart.product.map((item) => {
//         if (!item.productId.name) {
//           throw new Error('Item name is required');
//         }
//         return {
//           productId: item.productId._id,
//           name: item.productId.name,
//           image: item.productId.image,
//           productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
//           quantity: item.quantity,
//           price: item.productId.discountPrice > 0
//             ? item.productId.discountPrice * item.quantity
//             : item.productId.price * item.quantity,
//           status: status === "Success" ? "Confirmed" : "Pending",
//           cancellationReason: item.cancellationReason,
//           cancellationDate: item.cancellationDate,
//         };
//       }),
//       billTotal,
//       shippingAddress,
//       paymentMethod: paymentMethod || 'razorpay',
//       paymentStatus: status || 'Pending',
//       couponAmount,
//       couponCode,
//       couponId,
//       razorpay_Order_Id: order_id,
//       razorpayPaymentId: payment_id,
//       razorpaySignature: signature,
//     });

//     console.log("Attempting to save order");
//     await newOrder.save();
//     console.log("Order saved successfully:", newOrder);

//     if (status === "Success") {
//       console.log("Updating product stock and clearing cart");
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

//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } else {
//       res.status(201).json({ success: true, message: "Payment status not successful" });
//     }

//   } catch (error) {
//     console.error("Error in onlineOrderPlacing:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },

// new 

// lasttt used new
// onlineOrderPlacing: async (req, res) => {
//   try {
//     console.log("Entering onlineOrderPlacing function");
    
//     const userId = req.session.user && req.session.user.id;
//     if (!userId) {
//       console.log("User not logged in");
//       return res.status(400).json({ success: false, message: "User not logged in" });
//     }
//     console.log("User ID:", userId);

//     const cart = await Cart.findOne({ userId }).populate("product.productId");
//     if (!cart || !cart.product.length) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // console.log("Full request:", req);

//     // Log specific parts of the request
//     // console.log("Request body:", req.body);
//     // console.log("Request query:", req.query);
//     // console.log("Request headers:", req.headers);

//     console.log("Request body:", req.body);
//     console.log("Request query:", req.query);

//     const { addressIndex, status, paymentMethod ,subtotal} = req.body;
//     const { order_id, payment_id, signature, couponId, totalAmount } = req.body;
    
//     console.log("Received values:", { addressIndex, paymentMethod, totalAmount, order_id, payment_id, signature, couponId, subtotal });



//     console.log("Request body:", req.body);
//     console.log("Request query:", req.query);

//     // Fallback to the first address if addressIndex is not provided
//     const selectedAddress = addressIndex ? user.address[addressIndex] : user.address[0];

//     // If no address is available, use a placeholder
//     const shippingAddress = selectedAddress ? {
//       houseName: selectedAddress.houseName || 'Not provided',
//       street: selectedAddress.street || 'Not provided',
//       city: selectedAddress.city || 'Not provided',
//       state: selectedAddress.state || 'Not provided',
//       country: selectedAddress.country || 'Not provided',
//       postalCode: selectedAddress.postalCode || 'Not provided',
//     } : {
//       houseName: 'Not provided',
//       street: 'Not provided',
//       city: 'Not provided',
//       state: 'Not provided',
//       country: 'Not provided',
//       postalCode: 'Not provided',
//     };

//     let couponAmount = 0;
//     let couponCode = null;
//     let billTotal = 0;

//     // Calculate the total bill amount
//     for (const item of cart.product) {
//       const productPrice = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//       billTotal += productPrice * item.quantity;
//     }

//     if (couponId) {
//       const coupon = await Coupon.findById(couponId);
//       if (coupon) {
//         const discountAmount = (billTotal * coupon.discountamount) / 100;
//         billTotal -= discountAmount;
//         couponAmount = discountAmount;
//         couponCode = coupon.couponcode;
//       }
//     }

//     // Convert totalAmount to paise (integer)
//     const amountInPaise = Math.round(totalAmount * 100);

//     const newOrder = new Order({
//       orderId: order_id || uuidv4(),
//       user: userId,
//       items: cart.product.map((item) => {
//         if (!item.productId.name) {
//           throw new Error('Item name is required');
//         }
//         return {
//           productId: item.productId._id,
//           name: item.productId.name,
//           image: item.productId.image,
//           productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
//           quantity: item.quantity,
//           price: item.productId.discountPrice > 0
//             ? item.productId.discountPrice * item.quantity
//             : item.productId.price * item.quantity,
//           status: status === "Success" ? "Confirmed" : "Pending",
//           cancellationReason: item.cancellationReason,
//           cancellationDate: item.cancellationDate,
//         };
//       }),
//       billTotal, // Keep billTotal in rupees for database
//       shippingAddress,
//       paymentMethod: paymentMethod || 'razorpay',
//       paymentStatus: status || 'Pending',
//       couponAmount,
//       couponCode,
//       couponId,
//       razorpay_Order_Id: order_id,
//       razorpayPaymentId: payment_id,
//       razorpaySignature: signature,
//     });

//     console.log("Attempting to save order");
//     await newOrder.save();
//     console.log("Order saved successfully:", newOrder);

//     if (status === "Success") {
//       console.log("Updating product stock and clearing cart");
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

//       res.status(201).json({ success: true, message: "Order placed successfully" });
//     } else {
//       res.status(201).json({ success: true, message: "Payment status not successful" });
//     }

//   } catch (error) {
//     console.error("Error in onlineOrderPlacing:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// },





onlineOrderPlacing: async (req, res) => {
  try {
    console.log("Entering onlineOrderPlacing function");
    console.log("Full request body:", JSON.stringify(req.body, null, 2));

    const userId = req.session.user && req.session.user.id;
    if (!userId) {
      console.log("User not logged in");
      return res.status(400).json({ success: false, message: "User not logged in" });
    }
    console.log("User ID:", userId);

    const {
      order_id,
      payment_id,
      signature,
      status,
      addressIndex,
      paymentMethod,
      totalAmount,
      subtotal,
      couponId,
      couponcode
  } = req.body;


    console.log("Received values:", {
      order_id,
      payment_id,
      signature,
      status,
      addressIndex,
      paymentMethod,
      totalAmount,
      subtotal,
      couponId,
      couponcode
    });

    const cart = await Cart.findOne({ userId }).populate("product.productId");
    if (!cart || !cart.product.length) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Select address
    const selectedAddress = addressIndex !== undefined && user.address[addressIndex] 
      ? user.address[addressIndex] 
      : user.address[0] || {};

    const shippingAddress = {
      houseName: selectedAddress.houseName || 'Not provided',
      street: selectedAddress.street || 'Not provided',
      city: selectedAddress.city || 'Not provided',
      state: selectedAddress.state || 'Not provided',
      country: selectedAddress.country || 'Not provided',
      postalCode: selectedAddress.postalCode || 'Not provided',
    };

    // Recalculate billTotal
    let billTotal = parseFloat(subtotal);
    let couponAmount = 0;
    let couponCode = null;

    if (couponId) {
      const coupon = await Coupon.findById(couponId);
      if (coupon) {
        couponAmount = (billTotal * coupon.discountamount) / 100;
        billTotal -= couponAmount;
        couponCode = coupon.couponcode;
      }
    }

    console.log("Calculated billTotal:", billTotal);
    console.log("Calculated couponAmount:", couponAmount);

    // Verify if calculated billTotal matches the received totalAmount
    if (Math.abs(billTotal - parseFloat(totalAmount)) > 0.01) {
      console.log("Calculated billTotal doesn't match received totalAmount");
      return res.status(400).json({ success: false, message: "Total amount mismatch" });
    }

    const newOrder = new Order({
      orderId: order_id || uuidv4(),
      user: userId,
      items: cart.product.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        image: item.productId.image,
        productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
        quantity: item.quantity,
        price: (item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price) * item.quantity,
        status: status === "Success" ? "Confirmed" : "Pending",
      })),
      billTotal,
      shippingAddress,
      paymentMethod: paymentMethod || 'razorpay',
      paymentStatus: status || 'Pending',
      couponAmount,
      couponCode,
      couponId,
      razorpay_Order_Id: order_id,
      razorpayPaymentId: payment_id,
      razorpaySignature: signature,
    });

    console.log("Attempting to save order");
    await newOrder.save();
    console.log("Order saved successfully:", newOrder);

    if (status === "Success") {
      console.log("Updating product stock and clearing cart");
      for (const item of newOrder.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
        console.log("Product stock updated:", item.productId);
      }

      await Cart.findOneAndDelete({ userId });
      console.log("Cart cleared for user:", userId);

      res.status(201).json({ success: true, message: "Order placed successfully" });
    } else {
      res.status(201).json({ success: true, message: "Payment status not successful" });
    }

  } catch (error) {
    console.error("Error in onlineOrderPlacing:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
},

























































cancelOrder: async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { orderId } = req.body;

    console.log("Cancel order request for user:", userId, "orderId:", orderId);

    // Validate the orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.log("Invalid orderId format:", orderId);
      return res.status(400).json({ success: false, message: "Invalid order ID format" });
    }

    // Find the order
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      console.log("Order not found or does not belong to user");
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Check if the order is already cancelled
    if (order.paymentStatus === "Cancelled") {
      console.log("Order is already cancelled");
      return res.status(400).json({ success: false, message: "Order is already cancelled" });
    }

    // Update the order status to 'Cancelled'
    order.paymentStatus = "Cancelled";
    await order.save();
    console.log("Order status updated to 'Cancelled'");

    // Update product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity }
      });
    }
    console.log("Product stock updated");

    // If payment was made through Razorpay, refund to wallet
    if (order.paymentMethod === "razorpay") {
      const user = await User.findById(userId);
      if (!user) {
        console.log("User not found for ID:", userId);
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // Update the user's wallet
      user.wallet.balance += order.billTotal;
      user.wallet.transactions.push({
        amount: order.billTotal,
        description: `Refund for cancelled order ${orderId}`,
        type: 'Refund'
      });
      await user.save();
      console.log("Amount refunded to wallet:", order.billTotal);
    }

    res.status(200).json({ success: true, message: "Order cancelled and amount refunded to wallet" });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
},








  // returnOrder: async (req, res) => {
  //   try {
  //     const { orderId, itemId, returnReason } = req.body;

  //     const order = await Order.findById(orderId);
  //     const userId = req.session.user.id;

  //     if (!order) {
  //       return res.status(404).json({ message: "Order not found" });
  //     }

  //     const item = order.items.find((item) => item._id == itemId);

  //     if (!item) {
  //       return res.status(404).json({ message: "Item not found in the order" });
  //     }

  //     item.status = "Returned";
  //     item.returnReason = returnReason;

  //     const refundAmount = item.productPrice * item.quantity;
  //     order.billTotal -= refundAmount;

  //     if (
  //       order.paymentMethod === "razorpay" ||
  //       order.paymentMethod === "wallet"
  //     ) {
  //       const wallet = await Wallet.findOne({ user: userId });
  //       if (!wallet) {
  //         throw new Error(`Wallet for user ${order.user._id} not found`);
  //       }

  //       const transaction = {
  //         amount: refundAmount,
  //         description: `Return refund for ${item.name} ${orderId}`,
  //         type: "Refund",
  //         transcationDate: new Date(),
  //       };
  //       wallet.transactions.push(transaction);

  //       wallet.walletBalance += refundAmount;

  //       order.paymentStatus = "Refunded";
  //       await wallet.save();
  //     }

  //     const allItemsReturned = order.items.every(
  //       (item) => item.status === "Returned"
  //     );

  //     if (allItemsReturned) {
  //       order.orderStatus = "Returned";
  //     }

  //     await order.save();
  //     res.status(201).json({message:"Item returned successfully"})
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // },



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


returnOrder: async (req, res) => {
  try {
    const { orderId, itemId, returnReason } = req.body;
    const userId = req.session.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const item = order.items.find((item) => item._id.toString() === itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in the order" });
    }

    item.status = "Returned";
    item.returnReason = returnReason;

    const refundAmount = item.productPrice * item.quantity;
    order.billTotal -= refundAmount;

    if (order.paymentMethod === "razorpay" || order.paymentMethod === "wallet") {
      const wallet = await Wallet.findOne({ user: userId });
      if (!wallet) {
        throw new Error(`Wallet for user ${userId} not found`);
      }

      const transaction = {
        amount: refundAmount,
        description: `Return refund for ${item.name} in Order ${orderId}`,
        type: "Refund",
        transactionDate: new Date(),
      };
      wallet.transactions.push(transaction);
      wallet.walletBalance += refundAmount;

      order.paymentStatus = "Refunded";
      await wallet.save();
    }

    const allItemsReturned = order.items.every((item) => item.status === "Returned");
    if (allItemsReturned) {
      order.orderStatus = "Returned";
    }

    await order.save();
    res.status(201).json({ message: "Item returned successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred while returning the item" });
  }
},







// checkWalletBalance: async (req, res) => {
//   try {
//       const userId = req.session.user.id;
//       console.log("User ID from session:", userId); // Debug log

//       // Parse totalAmount from query string
//       const totalAmount = parseFloat(req.query.totalAmount);
//       console.log("Total amount:", totalAmount); // Debug log

//       // Validate totalAmount
//       if (isNaN(totalAmount)) {
//           return res.status(400).json({ success: false, message: "Invalid total amount" });
//       }

//       // Fetch wallet information
//       const wallet = await Wallet.findOne({ user: userId });
//       console.log("Wallet retrieved:", wallet); // Debug log

//       // Handle case where wallet is not found
//       if (!wallet) {
//           return res.status(404).json({ success: false, message: "Wallet not found" });
//       }

//       // Respond with wallet balance
//       res.json({
//           success: true,
//           walletBalance: wallet.walletBalance
//       });
//   } catch (error) {
//       console.error("Error checking wallet balance:", error.message);
//       res.status(500).json({ success: false, message: "Internal server error" });
//   }
// },

// last
// checkWalletBalance: async (req, res) => {
//   try {
//     const userId = req.session.user.id;
//     console.log("User ID from session:", userId); // Debug log

//     // Parse totalAmount from query string
//     const totalAmount = parseFloat(req.query.totalAmount);
//     console.log("Total amount:", totalAmount); // Debug log

//     // Validate totalAmount
//     if (isNaN(totalAmount)) {
//       return res.status(400).json({ success: false, message: "Invalid total amount" });
//     }

//     // Fetch user information
//     const user = await User.findById(userId);
//     console.log("User retrieved:", user); // Debug log

//     // Handle case where user is not found
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // Retrieve wallet balance from user
//     const walletBalance = user.wallet ? user.wallet.balance : 0;
//     console.log("Wallet balance:", walletBalance); // Debug log

//     // Respond with wallet balance
//     res.json({
//       success: true,
//       walletBalance: walletBalance
//     });
//   } catch (error) {
//     console.error("Error checking wallet balance:", error.message);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// },

// checkWalletBalance : async (req, res) => {
//   try {
//     const userId = req.session.user.id;
//     console.log("User ID from session:", userId); // Debug log

//     // Parse totalAmount from query string
//     const totalAmount = parseFloat(req.query.totalAmount);
//     console.log("Total amount:", totalAmount); // Debug log

//     // Validate totalAmount
//     if (isNaN(totalAmount)) {
//       return res.status(400).json({ success: false, message: "Invalid total amount" });
//     }

//     // Fetch user information
//     const user = await User.findById(userId).select('wallet'); // Ensure the wallet field is included
//     console.log("User retrieved:", user); // Debug log

//     // Handle case where user is not found
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // Retrieve wallet balance from user
//     const walletBalance = user.wallet ? user.wallet.balance : 0;
//     console.log("Wallet balance:", walletBalance); // Debug log

//     // Respond with wallet balance
//     res.json({
//       success: true,
//       walletBalance: walletBalance
//     });
//   } catch (error) {
//     console.error("Error checking wallet balance:", error.message);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// },


// Controller function to check wallet balance
// 




checkWalletBalance:async (req, res) => {
  try {
      const userId = req.session.user.id;
      const totalAmount = parseFloat(req.query.totalAmount);

      if (isNaN(totalAmount)) {
          return res.status(400).json({ success: false, message: "Invalid total amount" });
      }

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      const walletBalance = user.wallet ? user.wallet.balance : 0;
      res.json({ success: true, walletBalance: walletBalance });
  } catch (error) {
      console.error('Error checking wallet balance:', error);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
},

walletPlaceOrder: async (req, res) => {
  try {
      console.log("Received request body:", req.body);
      const userId = req.session.user.id;

      // Destructure the request body
      const { addressIndex, totalAmount, paymentMethod, couponId, subtotal } = req.body;

      // Log the extracted values
      console.log("Payment method:", paymentMethod);
      console.log("Coupon ID:", couponId);

      // Validate couponId and paymentMethod
      if (couponId && mongoose.Types.ObjectId.isValid(couponId)) {
          const coupon = await Coupon.findById(couponId);
          if (coupon) {
              // Handle the coupon logic
              console.log("Valid Coupon Found:", coupon);
          } else {
              return res.status(404).json({ success: false, message: "Coupon not found" });
          }
      } else if (couponId) {
          return res.status(400).json({ success: false, message: "Invalid coupon ID" });
      }

      const cart = await Cart.findOne({ userId }).populate("product.productId");
      if (!cart || !cart.product.length) {
          return res.status(400).json({ success: false, message: "Cart is empty" });
      }

      const orderId = uuidv4();

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      const selectedAddress = user.address[addressIndex];

      let couponAmount = 0;
      let couponCode = '';

      if (couponId) {
          const coupon = await Coupon.findById(couponId);
          if (coupon) {
              couponAmount = (parseInt(subtotal) * coupon.discountamount) / 100;
              couponCode = coupon.couponcode;
          } else {
              return res.status(404).json({ success: false, message: "Coupon not found" });
          }
      }

      const newOrder = new Order({
          orderId,
          user: userId,
          items: cart.product.map(item => ({
              productId: item.productId._id,
              name: item.productId.name,
              image: item.productId.image,
              productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
              quantity: item.quantity,
              price: item.productId.discountPrice > 0 ? item.productId.discountPrice * item.quantity : item.productId.price * item.quantity,
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

      // Handle wallet payment
      if (paymentMethod === 'wallet') {
          const walletBalance = user.wallet ? user.wallet.balance : 0;

          if (walletBalance >= newOrder.billTotal) {
              user.wallet.balance -= newOrder.billTotal;
              user.wallet.transactions.push({
                  amount: newOrder.billTotal,
                  description: `Payment for order ${orderId}`,
                  type: "Debit",
                  transactionDate: new Date(),
              });
              await user.save();

              await Cart.findOneAndDelete({ userId });

              res.status(201).json({ success: true, message: "Order placed successfully", orderId: newOrder.orderId });
          } else {
              res.status(400).json({ success: false, message: "Insufficient wallet balance" });
          }
      } else {
          await Cart.findOneAndDelete({ userId });
          res.status(201).json({ success: true, message: "Order placed with other payment method", orderId: newOrder.orderId });
      }
  } catch (error) {
      console.log(error.message);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
},






//  wrking 
 
  // loadOrderView: async (req, res) => {
  //   try {
  //     const userId = req.session.user.id;
  //     const user = await User.findById(userId);
  //     const { id } = req.query;
  //     const order = await Order.findById(id);
  //     const cart = await Cart.findOne({ userId });
  //     let cartCount = 0;
  //     if (cart) {
  //       cartCount = cart.product.length;
  //     }
  //     res.render("viewOrder", { user, order, cartCount });
  //   } catch (error) {
  //     console.log(error.message);
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
  // },



// loadOrder: async (req, res) => {
//   try {
//       const page = parseInt(req.query.page) || 1;
//       const perPage = 10;
//       const totalOrderCount = await Order.countDocuments({});
//       const totalPages = Math.ceil(totalOrderCount / perPage);
//       const skip = (page - 1) * perPage;

//       const orders = await Order.find({}).populate('user').skip(skip).limit(perPage).sort({ orderDate: -1 });
//       res.render("order", { orders, currentPage: page, totalPages });
//   } catch (error) {
//       console.log(error.message);
//   }
// },

// wrking
// loadOrder: async (req, res) => {
//   try {
//       const page = parseInt(req.query.page) || 1; // Current page number
//       const perPage = 10; // Number of orders per page
//       const totalOrderCount = await Order.countDocuments({}); // Total number of orders
//       const totalPages = Math.ceil(totalOrderCount / perPage); // Total pages based on the number of orders and perPage
//       const skip = (page - 1) * perPage; // Number of orders to skip for pagination

//       const orders = await Order.find({}).populate('user').skip(skip).limit(perPage).sort({ orderDate: -1 });

//       // Render the 'order' page with orders, current page, and total pages
//       res.render("order", { orders, currentPage: page, totalPages });
//   } catch (error) {
//       console.log(error.message); // Log any errors
//       res.status(500).send("Internal Server Error");
//   }
// },

loadOrderView: async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await User.findById(userId);
    const { id } = req.query;

    // Populate the product details within the order
    const order = await Order.findById(id).populate('items.productId');
    console.log(order); // Log to verify populated data


    const cart = await Cart.findOne({ userId });
    let cartCount = 0;
    if (cart) {
      cartCount = cart.product.length;
    }

    // Pass the populated order with product details to the view
    res.render("viewOrder", { user, order, cartCount });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
},





















loadOrder: async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number, defaults to 1
    const perPage = 10; // Number of orders per page
    const totalOrderCount = await Order.countDocuments({}); // Total number of orders
    const totalPages = Math.ceil(totalOrderCount / perPage); // Total pages based on the number of orders and perPage
    const skip = (page - 1) * perPage; // Number of orders to skip for pagination

    const orders = await Order.find({})
      .populate('user') // Populate the 'user' field in the orders
      .skip(skip) // Skip the previous orders based on the page number
      .limit(perPage) // Limit the results to 'perPage'
      .sort({ orderDate: -1 }); // Sort orders by 'orderDate' in descending order

    // Render the 'order' page with orders, current page, and total pages
    res.render("order", { 
      orders, 
      currentPage: page, 
      totalPages 
    });
  } catch (error) {
    console.log(error.message); // Log any errors
    res.status(500).send("Internal Server Error");
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
},


// downloadInvoice : async (req, res) => {
//   try {
//     const { orderId } = req.query;

//     const order = await Order.findById(orderId).populate("user");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     generateInvoicePDF(order, res);
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// },

//  generateInvoicePDF : async function (order, res) {
//   const doc = new PDFDocument();
//   const filename = `invoice_${order._id}.pdf`;

//   res.setHeader("Content-Type", "application/pdf");
//   res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

//   doc.pipe(res);

//   doc.fontSize(20).text("Invoice", { align: "center" });
//   doc.moveDown();

//   // Add order details
//   doc.fontSize(12).text(`Order ID: ${order._id}`);
//   doc.text(`Order Date: ${new Date(order.orderDate).toLocaleString("en-IN")}`);
//   doc.text(`Payment Method: ${order.paymentMethod}`);
//   doc.text(`Payment Status: ${order.paymentStatus}`);
//   doc.text(
//     `Shipping Address: ${order.shippingAddress.houseName}, ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.country}, ${order.shippingAddress.postalCode}`
//   );
//   doc.moveDown();

//   // Create the table data
//   const table = {
//     headers: ["Product Name", "Quantity", "Price", "Total Price"],
//     rows: order.items.map(item => [
//       item.productName, // Assuming productName is the field for the product title
//       item.quantity,
//       `₹${item.productPrice.toFixed(2)}`,
//       `₹${(item.productPrice * item.quantity).toFixed(2)}`
//     ])
//   };

//   // Draw the table with styling
//   doc.table(table, {
//     prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),
//     prepareRow: (row, i) => doc.font("Helvetica").fontSize(10),
//     width: 500, 
//     align: "center", 
//     padding: 5, 
//     colors: ["#AE2424", "#AE2424", "#AE2424", "#AE2424"], 
//     borderWidth: 1,
//     headerBorderWidth: 1, 
//     rowEvenBackground: "#AE2424" 
//   });
   
//   doc.moveDown();

//   // Add total amount and coupon details
//   if (order.couponAmount > 0) {
//     doc.text(`Coupon Amount: ₹${order.couponAmount.toFixed(2)}`);
//   }
//   doc.text(`Grand Total: ₹${order.billTotal.toFixed(2)}`);

//   doc.end();
// },



// downloadInvoice : async (req, res) => {
//   try {
//     const { orderId } = req.query;

//     const order = await Order.findById(orderId).populate("user");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     const doc = new PDFDocument();
//     const filename = `invoice_${order._id}.pdf`;

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

//     doc.pipe(res);

//     // Add title and basic order details
//     doc.fontSize(20).text("Invoice", { align: "center" });
//     doc.moveDown();
//     doc.fontSize(12).text(`Order ID: ${order._id}`);
//     doc.text(`Order Date: ${new Date(order.orderDate).toLocaleString("en-IN")}`);
//     doc.text(`Payment Method: ${order.paymentMethod}`);
//     doc.text(`Payment Status: ${order.paymentStatus}`);
//     doc.text(
//       `Shipping Address: ${order.shippingAddress.houseName}, ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.country}, ${order.shippingAddress.postalCode}`
//     );
//     doc.moveDown();

//     // Add table headers
//     const tableTop = 200;
//     const itemCodeX = 50;
//     const descriptionX = 150;
//     const quantityX = 300;
//     const priceX = 350;
//     const totalX = 400;

//     doc.fontSize(12).text("Product Name", itemCodeX, tableTop, { bold: true });
//     doc.text("Quantity", quantityX, tableTop, { bold: true });
//     doc.text("Price", priceX, tableTop, { bold: true });
//     doc.text("Total Price", totalX, tableTop, { bold: true });

//     let yPos = tableTop + 20;

//     // Add table rows
//     order.items.forEach(item => {
//       doc.text(item.name, itemCodeX, yPos);
//       doc.text(item.quantity, quantityX, yPos);
//       doc.text(`₹${item.productPrice.toFixed(2)}`, priceX, yPos);
//       doc.text(`₹${(item.productPrice * item.quantity).toFixed(2)}`, totalX, yPos);
//       yPos += 20;
//     });

//     doc.moveDown();

//     // Add total amount and coupon details
//     if (order.couponAmount > 0) {
//       doc.text(`Coupon Amount: $${order.couponAmount.toFixed(2)}`, { align: "right" });
//     }
//     doc.text(`Grand Total: $${order.billTotal.toFixed(2)}`, { align: "right" });

//     doc.end();

//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// },


// wrking now error
// downloadInvoice : async (req, res) => {
//   try {
//     const { orderId } = req.query;

//     const order = await Order.findById(orderId).populate('user');

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     const doc = new PDFDocument({ margin: 50 });
//     const filename = `invoice_${order._id}.pdf`;

//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

//     doc.pipe(res);

//     // Header
//     doc.fontSize(20).text('INVOICE', { align: 'center', underline: true });
//     doc.moveDown(1.5);

//     // Order Details
//     doc.fontSize(12).text(`Order ID: ${order._id}`, { continued: true });
//     doc.text(`Date: ${new Date(order.orderDate).toLocaleString('en-IN')}`, { align: 'right' });
//     doc.moveDown(0.5);

//     doc.text(`Payment Method: ${order.paymentMethod}`, { continued: true });
//     doc.text(`Payment Status: ${order.paymentStatus}`, { align: 'right' });
//     doc.moveDown(0.5);

//     // Shipping Address
//     doc.text(`Shipping Address:`, { underline: true });
//     doc.text(`${order.shippingAddress.houseName}, ${order.shippingAddress.street}`);
//     doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`);
//     doc.text(`${order.shippingAddress.country} - ${order.shippingAddress.postalCode}`);
//     doc.moveDown(1);

//     // Table Headers
//     const tableTop = 250;
//     const itemX = 50;
//     const quantityX = 250;
//     const priceX = 320;
//     const totalX = 400;

//     doc
//       .fontSize(12)
//       .font('Helvetica-Bold')
//       .text('Product Name', itemX, tableTop)
//       .text('Quantity', quantityX, tableTop)
//       .text('Price', priceX, tableTop)
//       .text('Total', totalX, tableTop);

//     // Draw a horizontal line after headers
//     doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

//     let yPos = tableTop + 20;

//     // Table Rows
//     doc.font('Helvetica');
//     order.items.forEach(item => {
//       doc
//         .text(item.name, itemX, yPos)
//         .text(item.quantity, quantityX, yPos)
//         .text(`₹${item.productPrice.toFixed(2)}`, priceX, yPos)
//         .text(`₹${(item.productPrice * item.quantity).toFixed(2)}`, totalX, yPos);
//       yPos += 20;
//     });

//     // Draw a horizontal line after the last row
//     doc.moveTo(50, yPos).lineTo(550, yPos).stroke();

//     // Total and Coupon Details
//     yPos += 20;
//     doc
//       .font('Helvetica-Bold')
//       .text('Subtotal:', totalX - 100, yPos, { continued: true })
//       // .text(`₹${order.billTotal.toFixed(2)}`, { align: 'right' });
//       .text(`₹${order.subtotal.toFixed(2)}`, { align: 'right' });

      

//     if (order.couponAmount > 0) {
//       yPos += 20;
//       doc
//         .font('Helvetica-Bold')
//         .text('Coupon Discount:', totalX - 100, yPos, { continued: true })
//         .text(`-₹${order.couponAmount.toFixed(2)}`, { align: 'right' });
//     }

//     yPos += 20;
//     doc
//       .font('Helvetica-Bold')
//       .text('Grand Total:', totalX - 100, yPos, { continued: true })
//       .text(`₹${order.billTotal.toFixed(2)}`, { align: 'right' });

//     // Footer
//     doc.moveDown(2);
//     doc.fontSize(10).text('Thank you for your purchase!', { align: 'center' });

//     doc.end();
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// },



downloadInvoice: async (req, res) => {
  try {
    console.log('Download invoice request received'); // Start of function

    const { orderId } = req.query;
    console.log('Order ID:', orderId); // Log the order ID received

    const order = await Order.findById(orderId).populate('user');
    console.log('Order found:', order); // Log the order object

    if (!order) {
      console.log('Order not found');
      return res.status(404).json({ message: 'Order not found' });
    }

    const doc = new PDFDocument({ margin: 50 });
    const filename = `invoice_${order._id}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    console.log('Headers set, starting PDF generation');

    doc.pipe(res);

    // Header
    doc.fontSize(20).text('INVOICE', { align: 'center', underline: true });
    doc.moveDown(1.5);

    // Order Details
    doc.fontSize(12).text(`Order ID: ${order._id}`, { continued: true });
    doc.text(`Date: ${new Date(order.orderDate).toLocaleString('en-IN')}`, { align: 'right' });
    doc.moveDown(0.5);

    doc.text(`Payment Method: ${order.paymentMethod}`, { continued: true });
    doc.text(`Payment Status: ${order.paymentStatus}`, { align: 'right' });
    doc.moveDown(0.5);

    console.log('Order details added to PDF');

    // Shipping Address
    doc.text(`Shipping Address:`, { underline: true });
    doc.text(`${order.shippingAddress.houseName}, ${order.shippingAddress.street}`);
    doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`);
    doc.text(`${order.shippingAddress.country} - ${order.shippingAddress.postalCode}`);
    doc.moveDown(1);

    console.log('Shipping address added to PDF');

    // Table Headers
    const tableTop = 250;
    const itemX = 50;
    const quantityX = 250;
    const priceX = 320;
    const totalX = 400;

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Product Name', itemX, tableTop)
      .text('Quantity', quantityX, tableTop)
      .text('Price', priceX, tableTop)
      .text('Total', totalX, tableTop);

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
    let yPos = tableTop + 20;

    console.log('Table headers added to PDF');

    // Table Rows
    doc.font('Helvetica');
    order.items.forEach((item, index) => {
      console.log(`Adding item ${index + 1}:`, item);
      doc
        .text(item.name, itemX, yPos)
        .text(item.quantity, quantityX, yPos)
        .text(`₹${item.productPrice.toFixed(2)}`, priceX, yPos)
        .text(`₹${(item.productPrice * item.quantity).toFixed(2)}`, totalX, yPos);
      yPos += 20;
    });

    doc.moveTo(50, yPos).lineTo(550, yPos).stroke();

    console.log('Table rows added to PDF');

    // Calculate Subtotal
    const subtotal = order.items.reduce((sum, item) => {
      const itemTotal = item.productPrice * item.quantity;
      return sum + itemTotal;
    }, 0);
    
    console.log('Calculated Subtotal:', subtotal); // Log the calculated subtotal

    // Total and Coupon Details
    yPos += 20;
    doc
      .font('Helvetica-Bold')
      .text('Subtotal:', totalX - 100, yPos, { continued: true })
      .text(`₹${subtotal.toFixed(2)}`, { align: 'right' });

    if (order.couponAmount > 0) {
      yPos += 20;
      console.log('Adding coupon discount');
      doc
        .font('Helvetica-Bold')
        .text('Coupon Discount:', totalX - 100, yPos, { continued: true })
        .text(`-₹${order.couponAmount.toFixed(2)}`, { align: 'right' });
    }

    yPos += 20;
    doc
      .font('Helvetica-Bold')
      .text('Grand Total:', totalX - 100, yPos, { continued: true })
      .text(`₹${order.billTotal.toFixed(2)}`, { align: 'right' });

    console.log('Totals added to PDF');

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).text('Thank you for your purchase!', { align: 'center' });

    console.log('Footer added, finishing PDF');
    doc.end();
  } catch (error) {
    console.log('Error occurred:', error); // Log the full error
    res.status(500).json({ message: 'Internal Server Error' });
  }
},















retryOrder : async (req, res) => {
  try {
    const { orderId, totalAmount } = req.body;

    const options = {
      amount: totalAmount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_${orderId}`,
    };

    razorpayInstance.orders.create(options, function (err, order) {
      if (!err) {
        res.status(200).json({
          success: true,
          msg: "Order Created",
          order_id: order.id,
          amount: totalAmount * 100,
          key_id: process.env.RAZOR_PAY_KEY,
          product_name: "Book's Kart  ",
          description: "Payment for retry order",
          contact: "8988776655", // Ensure this is dynamic in real-world use
          name: "", // Ensure this is dynamic in real-world use
          email: "", // Ensure this is dynamic in real-world use
        });
      } else {
        console.log("Error in Razorpay order creation:", err);
        res.status(500).json({ success: false, message: "Failed to create order" });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
},

retryPayment :async (req, res) => {
  try {
    const { orderId, totalAmount, status } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.paymentStatus = status;

    await order.save();

    if (status === "Failed") {
      return res.status(201).json({ success: true, message: "Payment failed, please retry" });
    }

    res.status(201).json({ success: true, message: "Order placed successfully" });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}



}
































module.exports = orderManagement;
