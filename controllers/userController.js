
mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();
const passport = require("passport");
const User= require("../model/userModel");
const Product = require("../model/productModel");
const Cart = require("../model/cartModel")
const Order= require("../model/orderModel");
const Coupon = require("../model/couponModel");
const Wishlist= require("../model/wishListModel");
const Wallet= require("../model/walletModel");
const Otp= require("../model/otpModel");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Generate a 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Securely hash the password
const securePassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// User controller object
const userController = {
  // homePage: (req, res) => {
  //   res.render('home');
  // },


  homePage: async (req, res) => {
    try {
      // Fetch products from the database
      const products = await Product.find({}).limit(8); // Adjust the limit as needed

      // Render the home page and pass the products
      res.render('home', { products: products });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).render('error', { message: 'Error loading products' });
    }
  },


  loadSignup: (req, res) => {
    res.render('signup');
  },
  processSignup: async (req, res) => {
    try {
        
      const details = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        otp: generateOtp(),
        otpExpiration: Date.now() + 5 * 60 * 1000 // 5 minutes expiration
      };
      console.log('saww',req.body)

      console.log('sfsfsf',details)

      req.session.details = details;
      req.session.details = details;
      req.session.save();
      res.redirect("/otpVerify");
      console.log(req.session.details.otp);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: "OTP verification",
        text: `Your OTP for verification is: ${details?.otp}`,
      };

      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error occurred while sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

    //   res.redirect("/otpVerify");
    } catch (error) {
      console.log("Error in processSignup:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  loadLogin: (req, res) => {
    res.render('login');
  },


processLogin: async (req, res) => {
  try {
      const { email, password } = req.body;
      console.log("Login attempt with email:", email);

      const user = await User.findOne({ email });

      if (!user) {
          console.log("User not found for email:", email);
          return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match status:", isMatch);

      if (!isMatch) {
          console.log("Password does not match for user:", email);
          return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      req.session.user = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
      };
      console.log("user logged in:", req.session.user);

      res.json({ success: true });
  } catch (error) {
      console.log("Error in processLogin:", error.message);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
},




  loadOTP: (req, res) => {
    try {
      res.render("otp", { message: "" });
    } catch (error) {
      console.log("Error in loadOTP:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  verifyOTP: async (req, res) => {
    try {
        console.log('Incoming OTP:', req.body.otp);

        if (!req.session.details) {
            console.log('Session expired.');
            return res.json({ status: "error", message: "Session expired. Please start over." });
        }

        console.log('Session details:', req.session.details);
        console.log('Session OTP:', req.session.details.otp);
        console.log('OTP Expiration:', req.session.details.otpExpiration);

        const inputOtp = parseInt(req.body.otp, 10);
        console.log('Parsed Input OTP:', inputOtp);

        if (req.session.details.otp === inputOtp) {
            if (req.session.details.otpExpiration < Date.now()) {
                console.log('OTP expired.');
                return res.json({ status: "error", message: "OTP expired. Please request a new one." });
            } else {
                console.log('OTP valid, creating user...');
                const hashedPassword = await securePassword(req.session.details.password);
                console.log('Hashed Password:', hashedPassword);

                const user = new User({
                    name: req.session.details.name,
                    email: req.session.details.email,
                    password: hashedPassword,
                    isAdmin: 0,
                    isBlocked: false,
                });

                await user.save();
                console.log('User created successfully.');
                // req.session.destroy();
                return res.json({ status: "success", message: "OTP verified successfully. Redirecting to login." });
            }
        } else {
            console.log('Invalid OTP.');
            return res.json({ status: "error", message: "Invalid OTP. Please try again." });
        }
    } catch (error) {
        console.log("Error in verifyOTP:", error.message);
        console.error("Detailed error:", error);
        res.status(500).json({ status: "error", message: "Internal server error. Please try again later." });
    }
},

  
  // verifyOTP: async (req, res) => {
  //   try {

  //     console.log(req.body,'incomming otp')
  //     if (!req.session.details) {
  //       return res.json({ message: "Session expired. Please start over." });
  //     }

  //     if (req.session.details.otp === parseInt(req.body.otp)) {
  //       if (req.session.details.otpExpiration < Date.now()) {
  //         return res.json({ expired: true });
  //       } else {
  //         console.log(req.session.details,'session is comming')
  //         const hashedPassword = await securePassword(req.session.details.password);
  //         console.log(hashedPassword,'hello password')

  //         const user = new User({
  //           name: req.session.details.name,
  //           email: req.session.details.email,
  //           password: hashedPassword,
  //           isAdmin: 0,
  //           isBlocked: false,
  //         });
               
  //         await user.save();
  //       //   req.session.destroy();
  //         res. redirect("/login");
  //       }
  //     } else {
  //       return res.json({ message: "Invalid OTP" });
  //     }
  //   } catch (error) {
  //     console.log("Error in verifyOTP:", error.message);
  //     res.status(500).json({ message: "Internal server error" });
  //   }
  // },
  resendOTP: async (req, res) => {
    try {
      if (!req.session.details) {
        return res.json({ message: "Session expired. Please start over." });
      }

      const newOTP = generateOtp();
      req.session.details.otp = newOTP;
      req.session.details.otpExpiration = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.session.details.email,
        subject: "OTP verification",
        text: `Your new OTP for verification is: ${newOTP}`,
      };

      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error occurred while resending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      res.json({ success: true });
    } catch (error) {
      console.log("Error in resendOTP:", error.message);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },
  userLogout: async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.log("Error destroying session:", err);
        }
        res.redirect("/");
      });
    } catch (error) {
      console.log("Error in userLogout:", error.message);
      res.status(500).send("An error occurred during logout");
    }
  },


  loadForgotPassword: (req, res) => {
    try {
      res.render('forgotPassword');
    } catch (error) {
      console.error('Error fetching forgotPassword page:', error.message);
      res.status(500).send('Internal Server Error');
    }
  },




forgotPassword: async (req, res) => {
  try {
      const { email } = req.body;
      console.log('Forgot password request received for email:', email);

      const user = await User.findOne({ email });
      if (!user) {
          console.log('User not found for email:', email);
          return res.status(404).json({ message: 'User not found', messageType: 'error' });
      }

      const otpCode = generateOtp();
      console.log('Generated OTP:', otpCode);

      // Check if an OTP document already exists for this email
      let otpDoc = await Otp.findOne({ email });

      if (otpDoc) {
          // If it exists, update it
          otpDoc.otp = otpCode;
          otpDoc.createdAt = new Date(); // Reset the creation time
      } else {
          // If it doesn't exist, create a new one
          otpDoc = new Otp({
              email,
              otp: otpCode,
          });
      }

      await otpDoc.save();
      console.log('OTP saved/updated in database');

      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Password Reset OTP',
          text: `Your OTP code is ${otpCode}. This code will expire in 30 seconds.`
      };

      transport.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error('Error sending OTP email:', error);
              return res.status(500).json({ message: 'Error sending OTP email', messageType: 'error' });
          }
          console.log('OTP email sent successfully:', info.response);
          res.status(200).json({ message: 'An OTP has been sent to your email. Please check your inbox.', messageType: 'success' });
      });
  } catch (error) {
      console.error('Error during forgot password process:', error);
      res.status(500).json({ message: 'Internal Server Error', messageType: 'error' });
  }
},



resetPass: async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    console.log('Reset password request received:', req.body);

    if (!email || !otp || !newPassword) {
      console.log('All fields are required');
      return res.status(400).json({ message: 'All fields are required', messageType: 'error' });
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      console.log('No OTP record found for the provided email');
      return res.status(400).json({ message: 'Invalid or expired OTP', messageType: 'error' });
    }

    // Log stored OTP and provided OTP for debugging
    console.log('Stored OTP:', otpRecord.otp);
    console.log('Provided OTP:', otp.trim());

    // Check if OTP is expired
    const now = new Date();
    const otpAge = (now - otpRecord.createdAt) / 1000; // Age in seconds
    if (otpAge > 300) { // 5 minutes TTL
      await Otp.deleteOne({ email }); // Delete expired OTP
      console.log('Expired OTP');
      return res.status(400).json({ message: 'Invalid or expired OTP', messageType: 'error' });
    }

    // Compare the provided OTP with the stored OTP using simple string comparison
    const isMatch = otpRecord.otp === otp.trim();
    if (!isMatch) {
      console.log('Invalid OTP');
      return res.status(400).json({ message: 'Invalid or expired OTP', messageType: 'error' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and delete OTP
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    await Otp.deleteOne({ email }); // Delete OTP after successful reset

    console.log('Password has been reset successfully for email:', email);
    res.status(200).json({ message: 'Password has been reset successfully', messageType: 'success' });
  } catch (error) {
    console.error('Error during password reset process:', error.message);
    res.status(500).json({ message: 'Internal Server Error', messageType: 'error' });
  }
},












loadUser: async (req, res) => {
  try {
      const userId = req.session.user.id;

      // Fetch user data, including wallet
      const user = await User.findById(userId).populate('wallet.transactions');
      if (!user) {
          return res.status(404).send('User not found');
      }

      // Fetch user orders with pagination
      const page = parseInt(req.query.page) || 1;
      const perPage = 10;
      const totalOrderCount = await Order.countDocuments({ user: userId });
      const totalPages = Math.ceil(totalOrderCount / perPage);
      const skip = (page - 1) * perPage;

      const order = await Order.find({ user: userId }).skip(skip).limit(perPage).sort({ orderDate: -1 });

      // Calculate cart count
      const cart = await Cart.findOne({ userId });
      let cartCount = 0;
      if (cart) {
          cartCount = cart.product.length;
      }

      // Check if wallet exists and is populated
      const wallet = user.wallet ? user.wallet : null;

      console.log('Wallet:', wallet); // Debugging log

      // Render user account page with order pagination and wallet data
      res.render("userAccount", { user, order, cartCount, wallet, currentPage: page, totalPages });
  } catch (error) {
      console.error('Error loading user data:', error.message);
      res.status(500).send("Internal Server Error");
  }
},








  editDetails : async (req, res) => {
    try {
      const userId = req.session.user.id; // Assuming session user contains the user ID
      const { name, email } = req.body;
  
      // Update user details
      const user = await User.findByIdAndUpdate(userId, { name, email }, { new: true });
  
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
  
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },
  
   addAddress : async (req, res) => {
    try {
      const userId = req.session.user.id; // Assuming session user contains the user ID
      const { houseName, street, city, state, country, postalCode, phoneNo, addressType } = req.body;
  
      // Create address object
      const address = {
        houseName,        
        street,
        city,
        state,
        country,
        postalCode,
        phoneNumber: phoneNo,
        type: addressType
      };
  
      // Find user by ID and update the address array
      const updatedUser = await User.findByIdAndUpdate(userId, {
        $push: { address: address }
      }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.status(200).json({ success: true, message: 'Address added successfully', address: address });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  editAddress : async (req, res) => {
    try {
      const userId = req.session.user.id; // Extract user ID from session object
      const { id, houseName, street, city, state, country, postalCode, phoneNumber, addressType } = req.body;
  
      // Find user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Find address by ID
      const addressIndex = user.address.findIndex(addr => addr._id.toString() === id);
      if (addressIndex !== -1) {
        // Update address fields
        user.address[addressIndex].houseName = houseName;
        user.address[addressIndex].street = street;
        user.address[addressIndex].city = city;
        user.address[addressIndex].state = state;
        user.address[addressIndex].country = country;
        user.address[addressIndex].postalCode = postalCode;
        user.address[addressIndex].phoneNumber = phoneNumber;
        user.address[addressIndex].type = addressType;
  
        // Save the updated user document
        await user.save();
  
        res.json({ success: true, message: 'Address updated successfully' });
      } else {
        // Address not found
        res.status(404).json({ success: false, message: 'Address not found' });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },
  
  
   deleteAddress : async (req, res) => {
    try {
      const userId = req.session.user.id; // Assuming session user contains the user ID
      const addressId = req.query.id;
  
      // Find user by ID
      const user = await User.findById(userId);
  
      // Find the index of the address to delete
      const addressIndex = user.address.findIndex(addr => addr._id.toString() === addressId);
  
      if (addressIndex !== -1) {
        user.address.splice(addressIndex, 1); // Remove address from array
        await user.save(); // Save the updated user document
        res.json({ success: true, message: 'Address deleted successfully' });
      } else {
        // Address not found
        res.status(404).json({ success: false, message: 'Address not found' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  resetPassword:async(req,res)=>{
    try{
      const user= await User.findById(req.session.user);
      const {currentPassword,newPassword}=req.body;
    
      const validPassword=await bcrypt.compare(currentPassword,user.password)
      if(!validPassword){
        return res.json({ notMatch:true, message: 'Current password is incorrect' });
      }
      
      const spassword=await securePassword(newPassword);
      user.password=spassword;
      await user.save();
  
      return res.status(200).json({ success: true, message: 'Password reset successful' });
  
  
  
    }catch(error){
      console.log(error.message);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },
  



  // loadShop: async (req, res) => {
  //   try {
  //     const page = parseInt(req.query.page) || 1;
  //     const limit = parseInt(req.query.limit) || 5;
  //     const category = req.query.category;
  //     const sortBy = req.query.sortBy;
  //     const offset = (page - 1) * limit;
  
  //     let query = {};
  //     if (category) {
  //       query.category = category;
  //     }
  //     let sort = {};
  //       if (sortBy === 'priceAsc') {
  //           sort = { price: 1 }; // Sort by price ascending
  //       } else if (sortBy === 'priceDesc') {
  //           sort = { price: -1 }; // Sort by price descending
  //       }
  
  //     const total = await Product.countDocuments(query);
  //     const totalPages = Math.ceil(total / limit);
  //     const products = await Product.find(query).sort(sort).skip(offset).limit(limit);

  //     // const products = await Product.find(query).skip(offset).limit(limit);
       
  
  //     res.render('shop', { 
  //       products: products,
  //       currentPage: page,
  //       totalPages: totalPages,
  //       limit: limit,
  //       category: category,
  //       sortBy: sortBy
        
  //     });
  //   } catch (error) {
  //     console.log(error.message);
  //     res.status(500).send('Internal Server Error');
  //   }
  // },
  

  // last
//   loadShop: async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 5;
//         const category = req.query.category;
//         const sortBy = req.query.sortBy;
//         const offset = (page - 1) * limit;

//         let query = { isListed: 'Active' };  // Add this line to only fetch active products
//         if (category) {
//             query.category = category;
//         }

//         let sort = {};
//         if (sortBy === 'priceAsc') {
//             sort = { price: 1 };
//         } else if (sortBy === 'priceDesc') {
//             sort = { price: -1 };
//         }

//         const total = await Product.countDocuments(query);
//         const totalPages = Math.ceil(total / limit);
//         const products = await Product.find(query).sort(sort).skip(offset).limit(limit);

//         console.log("Fetched products:", products.map(p => ({ id: p._id, name: p.name, isListed: p.isListed }))); // Add this line for debugging

//         res.render('shop', { 
//             products: products,
//             currentPage: page,
//             totalPages: totalPages,
//             limit: limit,
//             category: category,
//             sortBy: sortBy
//         });
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).send('Internal Server Error');
//     }
// },


// last working
loadShop: async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = 6; 
      const category = req.query.category;
      const sortBy = req.query.sortBy;
      const offset = (page - 1) * limit;

      let query = { isListed: 'Active' }; 
      if (category) {
          query.category = category;
      }

      let sort = {};
      if (sortBy === 'priceAsc') {
          sort = { price: 1 };
      } else if (sortBy === 'priceDesc') {
          sort = { price: -1 };
      }

      const total = await Product.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      const products = await Product.find(query).sort(sort).skip(offset).limit(limit);

      // console.log("Number of products fetched:", products.length); // Log the number of products fetched
      // console.log("Fetched products:", products.map(p => ({ id: p._id, name: p.name, isListed: p.isListed }))); // Debugging

      res.render('shop', { 
          products: products,
          currentPage: page,
          totalPages: totalPages,
          limit: limit,
          category: category,
          sortBy: sortBy
      });
  } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
  }
},












loadProductDetails : async (req, res) => {
  try {
    const productId = req.query.id;
    if (!productId) {
      return res.status(400).send('Product ID is required');
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    const relatedProducts = await Product.find({ category: product.category, _id: { $ne: productId } }).limit(4);

      res.render('productDetails', { product, relProduct: relatedProducts });

    // res.render('productDetails', { product });
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
},
 

// working code
// addToCart : async (req, res) => {
//   try {
//     console.log("Received request body:", req.body);

//     if (!req.session?.user?.id) {
//       console.log("User not authenticated");
//       return res.status(401).json({ success: false, error: 'User not authenticated' });
//     }

//     const userId = req.session.user.id;
//     const {productId, quantity = 1 } = req.body;

//     console.log(`Adding product ${productId} with quantity ${quantity} for user ${userId}`);

//     const product = await Product.findById(productId);
//     if (!product) {
//       console.log("Product not found");
//       return res.status(404).json({ success: false, error: 'Product not found' });
//     }

//     let cart = await Cart.findOne({ userId });
//     if (!cart) {
//       console.log("Cart not found, creating new cart");
//       cart = new Cart({ userId, products: [] });
//     } else {
//       console.log("Existing cart found:", cart);
//     }

//     const existingProductIndex = cart.product.findIndex(p => p.productId.toString() === productId);
    
//     if (existingProductIndex > -1) {
//       console.log("Product exists in cart, updating quantity");
//       cart.product[existingProductIndex].quantity += parseInt(quantity);
//     } else {
//       console.log("Product does not exist in cart, adding new product");
//       cart.product.push({ productId, quantity: parseInt(quantity) });
//     }

//     console.log("Updated cart:", JSON.stringify(cart, null, 2));

//     await cart.save();

//     console.log("Cart saved successfully");

//     res.json({ 
//       success: true, 
//       message: 'Product added to cart successfully',
//       cartItemCount: cart.product.length,
//       productName: product.name
//     });
//   } catch (error) {
//     console.error("Error in addToCart:", error);
//     res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
//   }
// },



// new last used
// addToCart: async (req, res) => {
//   try {
//     console.log("Received request body:", req.body);

//     if (!req.session?.user?.id) {
//       console.log("User not authenticated");
//       return res.status(401).json({ success: false, error: 'User not authenticated' });
//     }

//     const userId = req.session.user.id;
//     const { productId, quantity = 1 } = req.body;

//     console.log(`Adding product ${productId} with quantity ${quantity} for user ${userId}`);

//     const product = await Product.findById(productId);
//     if (!product) {
//       console.log("Product not found");
//       return res.status(404).json({ success: false, error: 'Product not found' });
//     }

//     // Determine the price to use (discounted price if available, otherwise original price)
//     const priceToUse = product.discountPrice > 0 ? product.discountPrice : product.price;

//     let cart = await Cart.findOne({ userId });
//     if (!cart) {
//       console.log("Cart not found, creating new cart");
//       cart = new Cart({ userId, products: [] });
//     } else {
//       console.log("Existing cart found:", cart);
//     }

//     const existingProductIndex = cart.product.findIndex(p => p.productId.toString() === productId);
    
//     if (existingProductIndex > -1) {
//       console.log("Product exists in cart, updating quantity");
//       cart.product[existingProductIndex].quantity += parseInt(quantity);
//       cart.product[existingProductIndex].price = priceToUse; // Update price if necessary
//     } else {
//       console.log("Product does not exist in cart, adding new product");
//       cart.product.push({ 
//         productId, 
//         quantity: parseInt(quantity), 
//         price: priceToUse // Store the price in the cart
//       });
//     }

//     console.log("Updated cart:", JSON.stringify(cart, null, 2));

//     await cart.save();

//     console.log("Cart saved successfully");

//     res.json({ 
//       success: true, 
//       message: 'Product added to cart successfully',
//       cartItemCount: cart.product.length,
//       productName: product.name
//     });
//   } catch (error) {
//     console.error("Error in addToCart:", error);
//     res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
//   }
// },


addToCart: async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    // Check if user is authenticated
    if (!req.session?.user?.id) {
      console.log("User not authenticated");
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const userId = req.session.user.id;
    const { productId, quantity = 1 } = req.body;

    console.log(`Adding product ${productId} with quantity ${quantity} for user ${userId}`);

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Determine the price to use (discounted price if available, otherwise original price)
    const priceToUse = product.discountPrice > 0 ? product.discountPrice : product.price;

    // Find or create the cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      console.log("Cart not found, creating new cart");
      cart = new Cart({ userId, products: [] });
    } else {
      console.log("Existing cart found:", cart);
    }

    // Check if the product is already in the cart
    const existingProductIndex = cart.product.findIndex(p => p.productId.toString() === productId);

    if (existingProductIndex > -1) {
      // Update quantity if the product already exists
      console.log("Product exists in cart, updating quantity");
      cart.product[existingProductIndex].quantity += parseInt(quantity);
      cart.product[existingProductIndex].price = priceToUse; // Update price if necessary
    } else {
      // Add new product to the cart
      console.log("Product does not exist in cart, adding new product");
      cart.product.push({ 
        productId, 
        quantity: parseInt(quantity), 
        price: priceToUse // Store the price in the cart
      });
    }

    // Save the updated cart
    console.log("Updated cart:", JSON.stringify(cart, null, 2));
    await cart.save();
    console.log("Cart saved successfully");

    // Respond with success
    res.json({ 
      success: true, 
      message: 'Product added to cart successfully',
      cartItemCount: cart.product.length,
      productName: product.name
    });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
},












// wrking

//  loadCart : async (req, res) => {
//   try {
//     console.log("Session object:", req.session);

//     const userId = req.session.user ? req.session.user.id : null;
//     if (!userId) {
//       return res.render('cart', { cart: { products: [], totalPrice: 0 } });
//     }

//     const cart = await Cart.findOne({ userId }).populate('product.productId');
//     console.log("Cart object after fetching and populating:", JSON.stringify(cart, null, 2));

//     if (!cart || !cart.product || cart.product.length === 0) {
//       return res.render('cart', { cart: { products: [], totalPrice: 0 } });
//     }


//     cart.totalPrice = cart.product.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
//     console.log("Cart object after calculating totalPrice:", JSON.stringify(cart, null, 2));

//     res.render('cart', { cart });
//   } catch (error) {
//     console.log('Error Occurred: ', error);
//     res.status(500).send('Internal Server Error');
//   }
// },


// last used
// loadCart : async (req, res) => {
//   try {
//     console.log("Session object:", req.session);

//     const userId = req.session.user ? req.session.user.id : null;
//     if (!userId) {
//       return res.render('cart', { cart: { products: [], totalPrice: 0 } });
//     }

//     const cart = await Cart.findOne({ userId }).populate('product.productId');
//     console.log("Cart object after fetching and populating:", JSON.stringify(cart, null, 2));

//     if (!cart || !cart.product || cart.product.length === 0) {
//       return res.render('cart', { cart: { products: [], totalPrice: 0 } });
//     }

//     // Calculate totalPrice using discountPrice if available, otherwise use the original price
//     cart.totalPrice = cart.product.reduce((total, item) => {
//       const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//       return total + (price * item.quantity);
//     }, 0);

//     console.log("Cart object after calculating totalPrice:", JSON.stringify(cart, null, 2));

//     res.render('cart', { cart });
//   } catch (error) {
//     console.log('Error Occurred: ', error);
//     res.status(500).send('Internal Server Error');
//   }
// },


// wrking last updated
loadCart: async (req, res) => {
  try {
    console.log("Session object:", req.session);

    const userId = req.session.user ? req.session.user.id : null;
    if (!userId) {
      // Render cart page with an empty cart if user is not logged in
      return res.render('cart', { cart: { products: [], totalPrice: 0 } });
    }

    // Fetch the cart and populate product details
    const cart = await Cart.findOne({ userId }).populate('product.productId'); // Ensure 'products' matches your schema
    console.log("Cart object after fetching and populating:", JSON.stringify(cart, null, 2));

    // If cart doesn't exist or is empty
    if (!cart || !cart.product || cart.product.length === 0) {
      return res.render('cart', { cart: { products: [], totalPrice: 0 } });
    }

    // Calculate totalPrice using discountPrice if available, otherwise use the original price
    cart.totalPrice = cart.product.reduce((total, item) => {
      const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
      return total + (price * item.quantity);
    }, 0);

    cart.totalItems = cart.product.reduce((total, item) => total + item.quantity, 0);


    console.log("Cart object after calculating totalPrice:", JSON.stringify(cart, null, 2));

    // Render the cart page with the updated cart object
    res.render('cart', { cart });
  } catch (error) {
    console.log('Error Occurred: ', error);
    res.status(500).send('Internal Server Error');
  }
},













// wrking
//  updateCart : async (req, res) => {
//   try {
//     const { updates } = req.body;
//     const userId = req.session.user.id;

//     const cart = await Cart.findOne({ userId });

//     if (!cart) {
//       return res.status(400).json({ success: false, message: 'Cart not found' });
//     }

//     updates.forEach(update => {
//       const product = cart.product.find(p => p.productId.toString() === update.productId);
//       if (product) {
//         product.quantity = update.quantity;
//       }
//     });

//     await cart.save();

//     res.json({ success: true, message: 'Cart updated successfully' });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// },

// updated
// updateCart: async (req, res) => {
//   try {
//     const { updates } = req.body;
//     const userId = req.session.user.id;

//     const cart = await Cart.findOne({ userId });

//     if (!cart) {
//       return res.status(400).json({ success: false, message: 'Cart not found' });
//     }

//     updates.forEach(update => {
//       const product = cart.product.find(p => p.productId.toString() === update.productId);
//       if (product) {
//         if (update.quantity > 3) {
//           return res.status(400).json({ success: false, message: 'Maximum 3 quantities of a book can be purchased' });
//         }
//         product.quantity = update.quantity;
//       }
//     });

//     await cart.save();

//     res.json({ success: true, message: 'Cart updated successfully' });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// },

updateCart: async (req, res) => {
  try {
    const { updates } = req.body;
    const userId = req.session.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(400).json({ success: false, message: 'Cart not found' });
    }

    for (let update of updates) {
      const product = cart.product.find(p => p.productId.toString() === update.productId);
      if (product) {
        if (update.quantity > 3) {
          return res.status(400).json({ success: false, message: 'Maximum 3 quantities of a book can be purchased' });
        }
        product.quantity = update.quantity;
      }
    }

    await cart.save();

    res.json({ success: true, message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
},













// updateCart : async (req, res) => {
//   try {
//     const { updates } = req.body;
//     const userId = req.session.user.id;

//     // Find the cart for the user
//     const cart = await Cart.findOne({ userId }).populate('product.productId');

//     if (!cart) {
//       return res.status(400).json({ success: false, message: 'Cart not found' });
//     }

//     // Update the quantities for each product
//     updates.forEach(update => {
//       const product = cart.product.find(p => p.productId.toString() === update.productId);
//       if (product) {
//         product.quantity = update.quantity;
//       }
//     });

//     // Recalculate the subtotal
//     const totalPrice = cart.product.reduce((total, item) => {
//       const price = item.productId.discountPrice > 0 ? item.productId.discountPrice : item.productId.price;
//       return total + price * item.quantity;
//     }, 0);

//     // Update the cart with the new totalPrice
//     cart.totalPrice = totalPrice;

//     // Save the cart
//     await cart.save();

//     // Respond with success and updated cart info
//     res.json({ 
//       success: true, 
//       message: 'Cart updated successfully',
//       totalPrice: totalPrice.toFixed(2) // Send the updated total price
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// },











deleteCart : async (req, res) => {
  try {
    const userId = req.session.user.id; // Assuming you have the user ID in session
    const productId = req.body.productId; // Assuming productId is sent in the request body

    // Delete the product from the user's cart
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { product: { productId } } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found or product not in cart' });
    }

    res.json({ success: true, message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
},



// loadCheckout : async (req, res) => {
//   try {
//       const userId = req.session.user.id;
//       const user = await User.findById(userId);
//       const cart = await Cart.findOne({ userId: userId }).populate("product.productId");
//       const coupon = await Coupon.find({ status: "active" });
//       const wallet= await Wallet.findOne({user:userId});


//       let cartCount = 0;
//       if (cart) {
//           cartCount = cart.product.length;
//       }

//       // Ensure user.address is defined and is an array
//       user.address = user.address || [];

//       res.render("checkout", { user, cart, cartCount,coupon,wallet });

//   } catch (error) {
//       console.log(error.message);
//   }
// },


// loadCheckout : async (req, res) => {
//   try {
//     const userId = req.session.user.id;
//     const user = await User.findById(userId);
//     const cart = await Cart.findOne({ userId: userId }).populate("product.productId");
//     const coupon = await Coupon.find({ status: "active" });
//     const wallet = await Wallet.findOne({ user: userId });

//     let cartCount = 0;
//     if (cart) {
//       cartCount = cart.product.length;
//     }

//     // Ensure user.address is defined and is an array
//     user.address = user.address || [];

//     // Ensure wallet balance is defined and has a default value
//     const walletBalance = wallet ? wallet.balance : 0;

//     res.render("checkout", { user, cart, cartCount, coupon, walletBalance });

//   } catch (error) {
//     console.log(error.message);
//   }
// }

// loadCheckout : async (req, res) => {
//   try {
//     const userId = req.session.user.id;
//     const user = await User.findById(userId);
//     const cart = await Cart.findOne({ userId: userId }).populate("product.productId");
//     const coupon = await Coupon.find({ status: "active" });
//     const wallet = await Wallet.findOne({ user: userId });

//     let cartCount = 0;
//     if (cart) {
//       cartCount = cart.product.length;
//     }

//     // Ensure user.address is defined and is an array
//     user.address = user.address || [];

//     // Ensure wallet is defined and has a default value for balance
//     const walletData = wallet || { balance: 0 };

//     // Logging to verify data being passed
//     console.log('User:', user);
//     console.log('Cart:', cart);
//     console.log('Coupon:', coupon);
//     console.log('Wallet:', walletData);

//     res.render("checkout", { user, cart, cartCount, coupon, wallet: walletData });

//   } catch (error) {
//     console.log(error.message);
//     res.status(500).send('Server Error');
//   }
// },

loadCheckout: async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = await User.findById(userId);
    const cart = await Cart.findOne({ userId: userId }).populate("product.productId");
    const coupon = await Coupon.find({ status: "active" });


    let cartCount = 0;
    if (cart) {
      cartCount = cart.product.length;
    }

    // Ensure user.address is defined and is an array
    user.address = user.address || [];

    // Logging detailed information for debugging
    console.log('User:', JSON.stringify(user, null, 2));
    console.log('Cart:', JSON.stringify(cart, null, 2));
    console.log('Coupon:', JSON.stringify(coupon, null, 2));

    // Ensure user.wallet is defined and has a default value for balance
    const walletBalance = user.wallet ? user.wallet.balance : 0;

    res.render("checkout", { user, cart, cartCount, coupon, walletBalance, });

  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
},














confirmQuantity:async(req,res)=>{
  try{
      const userId=req.session.user;
      const cart=await Cart.findOne({userId});

      for(const item of cart.product){
          const product= await Product.findById(item.productId);

          //check of product exists
          if(!product){
              return res.json({success:false,message:"product not found"})
          }

          //check quantity 
          if (item.quantity <= 0 || item.quantity>product.stock){
              return res.json({success:false,message:"Quantity is invalid or out of stock"})
          }

          
      }
      //if all the checks passed
      return res.json({success:true}) 

  }catch(error){
      console.log(error.message);
      return res.status(500).json({ success: false, message: 'Internal server error' });
  }
},



 






// Load Wishlist
loadWishList : async (req, res) => {
  try {
    const userId = req.session.user.id;

    if (!userId) {
      console.error('User ID is not available in the session');
      return res.status(400).send('User not authenticated');
    }

    const user = await User.findById(userId).populate('wishlist.productId');

    if (!user) {
      console.error('User not found');
      return res.status(404).send('User not found');
    }

    const products = user.wishlist.map(item => item.productId).filter(Boolean);

    console.log('Products in wishlist:', products);

    res.render('wishList', { products });
  } catch (error) {
    console.error('Error loading wishlist:', error);
    res.status(500).send('Internal Server Error');
  }
},




addToWishList : async (req, res) => {
  try {
    const userId = req.session.user.id; // Assuming userId is stored in req.session.user
    const { productId } = req.body; // Extract productId from body (for POST request)

    console.log('Received Product ID from Body:', productId); // Log productId for debugging

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User not authenticated' });
    }

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is missing' });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the product is already in the user's wishlist
    // const productExists = user.wishlist.some(item => item.productId.toString() === productId);
    const productExists = user.wishlist.some(item => {
      if (item.productId) {
          console.log("Checking Product ID:", item.productId.toString()); // Debugging line
          return item.productId.toString() === productId;
      }
      return false;
  });

    if (productExists) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }

    // Add product to the user's wishlist
    user.wishlist.push({ productId });
    await user.save();

    res.status(200).json({ success: true, message: 'Product added to wishlist successfully' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
},


// wrking
// deleteWishList: async (req, res) => {
//   try {
//     const userId = req.session.user.id;
//     const productId = req.body.productId;

//     console.log('Attempting to delete product from wishlist:', { userId, productId });

//     if (!userId || !productId) {
//       console.log('User ID or Product ID is missing:', { userId, productId });
//       return res.status(400).json({ success: false, message: 'User ID or Product ID is missing' });
//     }

//     const result = await User.findByIdAndUpdate(
//       userId,
//       { $pull: { Wishlist: { productId } } },
//       { new: true }
//     );

//     if (!result) {
//       console.log('User not found or product not in wishlist');
//       return res.status(404).json({ success: false, message: 'User not found or product not in wishlist' });
//     }

//     console.log('Product removed from wishlist successfully');
//     res.json({ success: true, message: 'Product removed from wishlist successfully' });
//   } catch (error) {
//     console.error('Error in deleteWishList:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error', details: error.message });
//   }
// },




deleteWishList: async (req, res) => {
  try {
    const userId = req.session.user.id;
    const productId = req.body.productId;

    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: 'User ID or Product ID is missing' });
    }

    // Ensure the field name matches your schema
    const result = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: { productId } } },  // Make sure the field name is correct
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'User not found or product not in wishlist' });
    }

    // Logging the updated wishlist for debugging
    console.log('Updated Wishlist:', result.wishlist);

    res.json({ success: true, message: 'Product removed from wishlist successfully' });
  } catch (error) {
    console.error('Error in deleteWishList:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', details: error.message });
  }
},









addToCartFromWishlist: async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    if (!req.session?.user?.id) {
      console.log("User not authenticated");
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const userId = req.session.user.id;
    const { productId } = req.body;
    let quantity = parseInt(req.body.quantity) || 1; // Ensure quantity is a number, default to 1

    if (isNaN(quantity) || quantity < 1) {
      quantity = 1; // Set a minimum quantity of 1
    }

    console.log(`Adding product ${productId} from wishlist with quantity ${quantity} for user ${userId}`);

    const product = await Product.findById(productId);
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      console.log("Cart not found, creating new cart");
      cart = new Cart({ userId, product: [] });
    } else {
      console.log("Existing cart found:", cart);
    }

    const existingProductIndex = cart.product.findIndex(p => p.productId.toString() === productId);

    if (existingProductIndex > -1) {
      console.log("Product exists in cart, updating quantity");
      cart.product[existingProductIndex].quantity += quantity;
    } else {
      console.log("Product does not exist in cart, adding new product");
      cart.product.push({ productId, quantity });
    }

    console.log("Updated cart:", JSON.stringify(cart, null, 2));

    await cart.save();

    console.log("Cart saved successfully");

    // Remove the product from the wishlist
    await User.findByIdAndUpdate(userId, { $pull: { wishlist: { productId } } });

    res.json({
      success: true,
      message: 'Product added to cart and removed from wishlist successfully',
      cartItemCount: cart.product.length,
      productName: product.name
    });
  } catch (error) {
    console.error("Error in addToCartFromWishlist:", error);
    res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
},


// searchProduct: async (req, res) => {
//   try {
//     const query = req.query.q;
    
//     // Search the products collection based on name, description, etc.
//     const products = await Product.find({
//       $or: [
//         { name: { $regex: query, $options: 'i' } },
//         { description: { $regex: query, $options: 'i' } },
//         // Add other fields as needed
//       ]
//     });

//     res.render('searchResult', { products, query }); // Render the search results view
//   } catch (error) {
//     console.error('Search error:', error);
//     res.status(500).send('Internal Server Error');
//   }




// }

searchProduct : async (req, res) => {
  try {
    const query = req.query.q;
    
    if (!query) {
        return res.status(400).json({ success: false, message: 'Query is required' });
    }

    // Search for products matching the query
    const products = await Product.find({
        $text: { $search: query }
    });

    res.render('searchResults', {
        query: query,
        products: products
    });

} catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
}



}
}


module.exports = userController;


