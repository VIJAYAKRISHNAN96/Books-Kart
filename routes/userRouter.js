
const express = require("express");
const userRouter = express.Router();
const passport = require('passport'); 
require('dotenv').config();

const userController = require("../controllers/userController");
const orderManagement = require("../controllers/orderManagement");
const auth = require("../middlewares/userAuth");
const googleAuthController = require('../controllers/googleAuthController');
const couponManagement = require("../controllers/couponManagement");
const verifyPaymentSignature= require("../controllers/razorpayUtils");


//  routes
userRouter.get("/", userController.homePage);
userRouter.get("/signup", auth.isLogOut, userController.loadSignup);
userRouter.post("/signup", userController.processSignup);

userRouter.get("/forgotPassword", auth.isLogOut, userController.loadForgotPassword);
userRouter.post("/forgotPassword", userController.forgotPassword);
userRouter.post("/resetPass", userController.resetPass);

userRouter.get("/login", auth.isLogOut, userController.loadLogin);
userRouter.post("/login", userController.processLogin);
userRouter.get('/logout', auth.isLogin, userController.userLogout);
userRouter.get("/otp", userController.loadOTP);
userRouter.get("/userAccount", auth.isLogin, userController.loadUser);
userRouter.post("/editdetails", userController.editDetails);
userRouter.post("/resetpassword", userController.resetPassword);
userRouter.post("/addAddress", userController.addAddress);
userRouter.post("/editAddress", userController.editAddress);
userRouter.post("/deleteAddress", userController.deleteAddress);

userRouter.get("/shop", userController.loadShop);
userRouter.get("/product", userController.loadProductDetails);

userRouter.post("/verifyOTP", userController.verifyOTP);
userRouter.post("/resendOTP", userController.resendOTP);
userRouter.get('/cart', auth.isLogin, userController.loadCart);
userRouter.post("/addToCart", auth.isLogin, userController.addToCart);
userRouter.post("/updateCart", auth.isLogin, userController.updateCart);
userRouter.post("/deleteCart", auth.isLogin, userController.deleteCart);

userRouter.get("/wishList",auth.isLogin,userController.loadWishList);
userRouter.post("/addToWishList",auth.isLogin,userController.addToWishList);
userRouter.post("/addToCartFromWishlist",auth.isLogin,userController.addToCartFromWishlist);

userRouter.post("/applyCoupon",auth.isLogin,couponManagement.applyCoupon);
userRouter.post("/removeCoupon",couponManagement.removeCoupon);

userRouter.post("/confirmQuantity",auth.isLogin,userController.confirmQuantity);

userRouter.delete("/deleteWishList",auth.isLogin,userController.deleteWishList);


userRouter.post('/placeOrder', auth.isLogin, orderManagement.placeOrder);

userRouter.post('/cancelOrder', orderManagement.cancelOrder);
userRouter.get('/viewOrder', orderManagement.loadOrderView);

userRouter.post('/onlineOrderPlacing',auth.isLogin, orderManagement.onlineOrderPlacing);

userRouter.get('/checkWalletBalance', orderManagement.checkWalletBalance);
userRouter.post('/walletPlaceOrder', orderManagement.walletPlaceOrder);
userRouter.put('/returnOrder', orderManagement.returnOrder);
userRouter.get('/downloadInvoice', orderManagement.downloadInvoice);
userRouter.put('/retryOrder', orderManagement.retryOrder);
userRouter.post('/retryPayment', orderManagement.retryPayment);

userRouter.get('/searchResults', userController.searchProduct);

userRouter.post("verifyPaymentSignature", verifyPaymentSignature.verifyPaymentSignature);

userRouter.get('/checkout', auth.isLogin, userController.loadCheckout);

userRouter.get('/otpVerify', auth.isLogOut, userController.loadOTP);

userRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
userRouter.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleAuthController.googleAuthCallback
);

module.exports = userRouter;
