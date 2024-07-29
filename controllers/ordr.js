const User = require("../model/userModel");
const Product = require("../model/productModel");
const Cart = require("../model/cartModel");
const Order = require("../model/orderModel");
const Wallet = require("../model/walletModel");
const Coupon = require("../model/coupenModel");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit-table");
const Razorpay = require("razorpay");
const { v4: uuidv4 } = require("uuid");
const { RAZOR_PAY_KEY, RAZOR_PAY_SECRET } = process.env;

const razorpayInstance = new Razorpay({
  key_id: RAZOR_PAY_KEY,
  key_secret: RAZOR_PAY_SECRET,
});

const orderManagement = {
  placeOrder: async (req, res) => {
    try {
      const userId = req.session.user;
      const cart = await Cart.findOne({ userId }).populate("product.productId");

      if (!cart || !cart.product.length) {
        return res.status(400).json({ success: false, message: "Cart is empty" });
      }

      const orderId = uuidv4();
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      let billTotal = 0;
      for (const item of cart.product) {
        billTotal += item.productId.price * item.quantity;
      }

      const { addressIndex, paymentMethod, totalAmount, couponId, subtotal } = req.body;
      const selectedAddress = user.address[addressIndex];

      if (paymentMethod == "razorpay") {
        var options = {
          amount: parseFloat(totalAmount) * 100,
          currency: "INR",
          receipt: `reciept_${cart._id}`,
        };
        razorpayInstance.orders.create(options, function (err, order) {
          if (!err) {
            res.status(200).json({
              success: true,
              msg: "Order Created",
              order_id: order.id,
              amount: totalAmount * 100,
              key_id: process.env.RAZOR_PAY_KEY,
              product_name: "product",
              description: "req.body.description",
              contact: "8567345632",
              name: "Sandeep Sharma",
              email: "sandeep@gmail.com",
            });
          } else {
            console.log("error --->", err);
          }
        });
      } else if (paymentMethod == "Cash On Delivery") {
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
            title: item.productId.title,
            image: item.productId.image,
            productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
            quantity: item.quantity,
            price: item.productId.discountPrice > 0 ? item.productId.discountPrice * item.quantity : item.productId.price * item.quantity,
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
          couponAmount,
          couponCode,
          couponId,
        });

        await newOrder.save();

        for (const item of newOrder.items) {
          const product = await Product.findById(item.productId);
          if (!product) {
            throw new Error(`Product with id ${item.productId} not found`);
          }
          product.stock -= item.quantity;
          await product.save();
        }

        await Cart.findOneAndDelete({ userId });

        res.status(201).json({ success: true, message: "Order placed successfully" });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  },

  onlinePlaceOrder: async (req, res) => {
    try {
      const userId = req.session.user;
      const cart = await Cart.findOne({ userId }).populate("product.productId");

      if (!cart || !cart.product.length) {
        return res.status(400).json({ success: false, message: "Cart is empty" });
      }
      const orderId = uuidv4();

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const { addressIndex, status, totalAmount, paymentMethod } = req.query;
      const { couponId, subtotal } = req.body;
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
          title: item.productId.title,
          image: item.productId.image,
          productPrice: item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price,
          quantity: item.quantity,
          price: item.productId.discountPrice > 0 ? item.productId.discountPrice * item.quantity : item.productId.price * item.quantity,
          status: status === "Success" ? "Confirmed" : "Pending",
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

        await Cart.findOneAndDelete({ userId });

        res.status(201).json({ success: true, message: "Order placed successfully" });
      } else if (newOrder.paymentStatus === "Failed") {
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
      const userId = req.session.user;
      const user = await User.findById(userId);
      const { id } = req.query;
      const order = await Order.findById(id);
      const cart = await Cart.findOne({ userId });
      let cartCount = 0;
      if (cart) {
        cartCount = cart.product.length;
      }
      res.render("orderView", { user, order, cartCount });
    } catch (error) {
      console.log(error.message);
    }
  },

  cancelOrder: async (req, res) => {
    try {
      const { orderId, itemId, cancellationReason } = req.body;
      const order = await Order.findById(orderId);
      const userId = req.session.user;
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
          description: `Refund for ${item.title} ${orderId}`,
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
      const userId = req.session.user;

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
          description: `Return refund for ${item.title} ${orderId}`,
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
      const userId = req.session.user;
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

  // walletPlaceOrder: async (req, res) => {
  //   try {
  //     const userId = req.session.user;
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

  //     const { addressIndex, totalAmount, paymentMethod, couponId, subtotal } =
  //       req.body;
  //     const { status } = req.query;
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
  //         status: "Confirmed",
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

  //     await newOrder 


      walletPlaceOrder: async (req, res) => {
        try {
          const userId = req.session.user;
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
              title: item.productId.title,
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
      
      loadOrderDetails: async (req, res) => {
        try {
          const userId = req.session.user;
          const user = await User.findById(userId);
          const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
          const cart = await Cart.findOne({ userId });
          let cartCount = 0;
          if (cart) {
            cartCount = cart.product.length;
          }
          res.render("orderDetails", { user, orders, cartCount });
        } catch (error) {
          console.log(error.message);
        }
      },
      
      generateInvoice: async (req, res) => {
        try {
          const orderId = req.params.orderId;
          const order = await Order.findById(orderId).populate("user");
      
          if (!order) {
            return res.status(404).send("Order not found");
          }
      
          const doc = new PDFDocument();
          const filename = `invoice_${orderId}.pdf`;
      
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      
          doc.pipe(res);
      
          // Add content to the PDF
          doc.fontSize(18).text("Invoice", { align: "center" });
          doc.moveDown();
          doc.fontSize(12).text(`Order ID: ${order.orderId}`);
          doc.text(`Date: ${order.createdAt.toDateString()}`);
          doc.moveDown();
          doc.text(`Customer: ${order.user.name}`);
          doc.text(`Email: ${order.user.email}`);
          doc.moveDown();
      
          // Create a table for order items
          const table = {
            headers: ["Item", "Quantity", "Price", "Total"],
            rows: order.items.map((item) => [
              item.title,
              item.quantity,
              `₹${item.productPrice}`,
              `₹${item.price}`,
            ]),
          };
      
          await doc.table(table, {
            prepareHeader: () => doc.font("Helvetica-Bold"),
            prepareRow: (row, i) => doc.font("Helvetica").fontSize(12),
          });
      
          doc.moveDown();
          doc.text(`Subtotal: ₹${order.billTotal}`);
          if (order.couponAmount) {
            doc.text(`Coupon Discount: ₹${order.couponAmount}`);
          }
          doc.text(`Total: ₹${order.billTotal - (order.couponAmount || 0)}`);
      
          doc.end();
        } catch (error) {
          console.error("Error generating invoice:", error);
          res.status(500).send("Error generating invoice");
        }
      },
      };
      
      module.exports = orderManagement;