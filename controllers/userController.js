
mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();

const User= require("../model/userModel");
const Product = require("../model/productModel");
const Cart = require("../model/cartModel")
const Order= require("../model/orderModel");


const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
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
  homePage: (req, res) => {
    res.render('home');
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
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).render('login', { message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).render('login', { message: 'Invalid email or password' });
      }

      req.session.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        
      };
      res.redirect('/');
    } catch (error) {
      console.log("Error in processLogin:", error.message);
      res.status(500).json({ message: "Internal server error" });
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

  // loadUser: async(req, res) => {
  //   res.render('userAccount');
  // },

  // loadUser : async (req, res) => {
  //   try {
  //     const userId = req.session.user;
  //     const user = await User.findById(userId);
  //     // const order = await Order.find({ user: userId });
  
  //     // Calculate cart count
  //     const cart = await Cart.findOne({ userId });
  //     let cartCount = 0;
  //     if (cart) {
  //       cartCount = cart.product.length;
  //     }
  
  //     res.render("userAccount", { user, order, cartCount });
  //   } catch (error) {
  //     console.error(error.message);
  //     res.status(500).send("Internal Server Error");
  //   }
  // },
  loadUser : async (req, res) => {
    try {
      const userId = req.session.user.id;
      const user = await User.findById(userId);
      
      // Uncomment and use the following line to retrieve user orders
      const order = await Order.find({ user: userId });
  
      // Calculate cart count
      const cart = await Cart.findOne({ userId });
      let cartCount = 0;
      if (cart) {
        cartCount = cart.product.length;
      }
  
      res.render("userAccount", { user, order, cartCount });
    } catch (error) {
      console.error(error.message);
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

  resetPassword :async(req,res)=>{
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
  

 
  
  








  loadShop: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const category = req.query.category;
      const sortBy = req.query.sortBy;
      const offset = (page - 1) * limit;
  
      let query = {};
      if (category) {
        query.category = category;
      }
      let sort = {};
        if (sortBy === 'priceAsc') {
            sort = { price: 1 }; // Sort by price ascending
        } else if (sortBy === 'priceDesc') {
            sort = { price: -1 }; // Sort by price descending
        }
  
      const total = await Product.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      const products = await Product.find(query).sort(sort).skip(offset).limit(limit);

      // const products = await Product.find(query).skip(offset).limit(limit);
       
  
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
  
  // loadProductDetail : async (req, res) => {
  //   try {
  //     const productId = req.params.productId;
  //     const product = await Product.findById(productId);
  
  //     if (!product) {
  //       return res.status(404).send('Product not found');
  //     }
  
  //     res.render('productDetails', {
  //       product: product,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send('Internal server error');
  //   }
  // },
  
  // 
//   loadProductDetails: async (req, res) => {
//     try {
//         const userId = req.session.user ? req.session.user.id : null; // Safely access user ID
//         const productId = req.params.productId; // Get product ID from request params

//         const product = await Product.findById(productId); // Fetch the product from the database
//         if (!product) {
//             return res.status(404).send('Product not found');
//         }

//         res.render('productDetails', { product, user: { id: userId } }); // Pass user ID to EJS
//     } catch (error) {
//         console.error('Error loading product details:', error);
//         res.status(500).send('Internal Server Error');
//     }
// },
// loadProductDetails: async (req, res) => {
//   try {
//       const productId = req.params.productId;
//       const product = await Product.findById(productId);

//       if (!product) {
//           return res.status(404).render('user/errorPage', { message: 'Product not found' });
//       }

//       res.render('user/productDetails', { product });
//   } catch (error) {
//       console.error('Error loading product details:', error);
//       res.status(500).render('user/errorPage', { message: 'Internal Server Error' });
  
//     }
// },



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
 


addToCart : async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    if (!req.session?.user?.id) {
      console.log("User not authenticated");
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const userId = req.session.user.id;
    const { productId, quantity = 1 } = req.body;

    console.log(`Adding product ${productId} with quantity ${quantity} for user ${userId}`);

    const product = await Product.findById(productId);
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      console.log("Cart not found, creating new cart");
      cart = new Cart({ userId, products: [] });
    } else {
      console.log("Existing cart found:", cart);
    }

    const existingProductIndex = cart.product.findIndex(p => p.productId.toString() === productId);
    
    if (existingProductIndex > -1) {
      console.log("Product exists in cart, updating quantity");
      cart.product[existingProductIndex].quantity += parseInt(quantity);
    } else {
      console.log("Product does not exist in cart, adding new product");
      cart.product.push({ productId, quantity: parseInt(quantity) });
    }

    console.log("Updated cart:", JSON.stringify(cart, null, 2));

    await cart.save();

    console.log("Cart saved successfully");

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




// working one

 loadCart : async (req, res) => {
  try {
    console.log("Session object:", req.session);

    const userId = req.session.user ? req.session.user.id : null;
    if (!userId) {
      return res.render('cart', { cart: { products: [], totalPrice: 0 } });
    }

    const cart = await Cart.findOne({ userId }).populate('product.productId');
    console.log("Cart object after fetching and populating:", JSON.stringify(cart, null, 2));

    if (!cart || !cart.product || cart.product.length === 0) {
      return res.render('cart', { cart: { products: [], totalPrice: 0 } });
    }

    cart.totalPrice = cart.product.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
    console.log("Cart object after calculating totalPrice:", JSON.stringify(cart, null, 2));

    res.render('cart', { cart });
  } catch (error) {
    console.log('Error Occurred: ', error);
    res.status(500).send('Internal Server Error');
  }
},


// new working
// loadCart: async (req, res) => {
//   try {
//     console.log("Session object:", req.session);

//     const userId = req.session.user ? req.session.user.id : null;
//     if (!userId) {
//       return res.render('cart', { cart: { products: [], totalPrice: 0, currentPage: 1, totalPages: 0 } });
//     }

//     const page = parseInt(req.query.page) || 1;
//     const limit = 5;
//     const skip = (page - 1) * limit;

//     const cart = await Cart.findOne({ userId }).populate('product.productId').lean();
//     console.log("Cart object after fetching and populating:", JSON.stringify(cart, null, 2));

//     if (!cart || !cart.product || cart.product.length === 0) {
//       return res.render('cart', { cart: { products: [], totalPrice: 0, currentPage: 1, totalPages: 0 } });
//     }

//     const totalProducts = cart.product.length;
//     const totalPages = Math.ceil(totalProducts / limit);

//     const paginatedProducts = cart.product.slice(skip, skip + limit);

//     cart.totalPrice = cart.product.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
//     console.log("Cart object after calculating totalPrice:", JSON.stringify(cart, null, 2));

//     res.render('cart', {
//       cart: {
//         products: paginatedProducts,
//         totalPrice: cart.totalPrice,
//         currentPage: page,
//         totalPages: totalPages
//       }
//     });
//   } catch (error) {
//     console.log('Error Occurred: ', error);
//     res.status(500).send('Internal Server Error');
//   }
// },

// loadCart: async (req, res) => {
//   try {
//     console.log("Session object:", req.session);

//     const userId = req.session.user ? req.session.user.id : null;
//     if (!userId) {
//       return res.render('cart', { cart: { products: [], totalPrice: 0, currentPage: 1, totalPages: 0 } });
//     }

//     const page = parseInt(req.query.page) || 1;
//     const limit = 5;
//     const skip = (page - 1) * limit;

//     const cart = await Cart.findOne({ userId }).populate('product.productId').lean();
//     console.log("Cart object after fetching and populating:", JSON.stringify(cart, null, 2));

//     if (!cart || !cart.product || cart.product.length === 0) {
//       return res.render('cart', { cart: { products: [], totalPrice: 0, currentPage: 1, totalPages: 0 } });
//     }

//     const totalProducts = cart.product.length;
//     const totalPages = Math.ceil(totalProducts / limit);

//     const paginatedProducts = cart.product.slice(skip, skip + limit);

//     cart.totalPrice = cart.product.reduce((total, item) => total + (item.productId.price * item.quantity), 0);
//     console.log("Cart object after calculating totalPrice:", JSON.stringify(cart, null, 2));

//     res.render('cart', {
//       cart: {
//         products: paginatedProducts,
//         totalPrice: cart.totalPrice,
//         currentPage: page,
//         totalPages: totalPages
//       }
//     });
//   } catch (error) {
//     console.log('Error Occurred: ', error);
//     res.status(500).send('Internal Server Error');
//   }
// },


 updateCart : async (req, res) => {
  try {
    const { updates } = req.body;
    const userId = req.session.user.id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(400).json({ success: false, message: 'Cart not found' });
    }

    updates.forEach(update => {
      const product = cart.product.find(p => p.productId.toString() === update.productId);
      if (product) {
        product.quantity = update.quantity;
      }
    });

    await cart.save();

    res.json({ success: true, message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
},




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







// loadCheckout :async(req,res)=>{
//   try{
//       const userId=req.session.user;
//       const user=await User.findById(userId);
//       const cart=await Cart.findOne({userId:userId}).populate("product.productId");
//       // const coupon=await Coupon.find({status:"active"});
//       // const wallet= await Wallet.findOne({user:userId});
      
//       let cartCount=0;
//       if(cart){
//          cartCount=cart.product.length;
//       }
//       res.render("checkout",{user,cart,cartCount})

//   }catch(error){
//       console.log(error.message);
//   }
// }

loadCheckout : async (req, res) => {
  try {
      const userId = req.session.user.id;
      const user = await User.findById(userId);
      const cart = await Cart.findOne({ userId: userId }).populate("product.productId");
      // const coupon = await Coupon.find({ status: "active" });

      let cartCount = 0;
      if (cart) {
          cartCount = cart.product.length;
      }

      // Ensure user.address is defined and is an array
      user.address = user.address || [];

      res.render("checkout", { user, cart, cartCount, });

  } catch (error) {
      console.log(error.message);
  }
}


}


module.exports = userController;


