const categoryModel = require("../model/categoryModel");
const userModel = require("../model/userModel");
const productModel = require("../model/productModel");
const Order = require("../model/orderModel");
const sharp = require("sharp");
const fs = require("fs");
const path = require('path');
const moment = require("moment");


// const User = require("../model/userModel");
const bcrypt = require("bcryptjs");

// Admin controller object
const adminController = {
  loadAdminLogin: (req, res) => {
    res.render("adminLogin");
  },
  processAdminLogin: async (req, res) => {
    const { email, password } = req.body;
    console.log("dssdsdsdfsdfsdfsdf", req.body);
    try {
      const adminData = await userModel.findOne({ email: email });
      if (adminData && adminData.isAdmin) {
        console.log(adminData.password, password);
        const passwordMatch = bcrypt.compareSync(password, adminData.password);
        console.log(passwordMatch);
        if (passwordMatch) {
          console.log(passwordMatch);
          req.session.adminSession = adminData._id;console.log("Session set:", req.session.adminSession);


          
          console.log("Redirecting to dashboard");
          return res.status(200).redirect("/admin/dashboard");
        } else {
          return res
            .status(401)
            .render("adminLogin", {message: `<script>Swal.fire({ title: 'Error!', text: 'Incorrect password', icon: 'error', confirmButtonText: 'OK' })</script>`});
        }
      } else {
        return res
          .status(401)
          .render("adminLogin", { message: `<script>Swal.fire({ title: 'Error!', text: 'Admin not found', icon: 'error', confirmButtonText: 'OK' })</script>` });
      }
    } catch (error) {
      console.log("Error in processAdminLogin", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },



// separating

// loadDashboard : async (req, res) => {
//   try {
//     console.log("Starting loadDashboard");

//     const products = await productModel.find();
//     console.log("Products fetched:", products.length);

//     const categories = await categoryModel.find();

//     const orders = await Order.find({ orderStatus: "Delivered" });
//     console.log("Total delivered orders:", orders.length);

//     const oneYearAgo = new Date();
//     oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
//     const recentOrders = await Order.find({ 
//       orderStatus: "Delivered",
//       orderDate: { $gte: oneYearAgo }
//     });
//     console.log("Delivered orders in the last year:", recentOrders.length);




//     // Calculate total and monthly revenue
//     const totalRevenue = orders.reduce((acc, order) => acc + order.billTotal, 0);
//     const currentMonth = moment().month() + 1;
//     const currentYear = moment().year();
//     const monthlyOrders = orders.filter(order =>
//       moment(order.createdOn).month() + 1 === currentMonth &&
//       moment(order.createdOn).year() === currentYear
//     );
//     const monthlyRevenue = monthlyOrders.reduce((acc, order) => acc + order.billTotal, 0);

//     // Aggregate Top 10 Best-Selling Products
//     const topSellingProducts = await Order.aggregate([
//       { $unwind: "$items" },
//       { $group: { 
//         _id: "$items.productId", 
//         name: { $first: "$items.name" },
//         totalSold: { $sum: "$items.quantity" } 
//       }},
//       { $sort: { totalSold: -1 } },
//       { $limit: 10 }
//     ]);

//     // Aggregate Top 10 Best-Selling Categories
//     const topSellingCategories = await Order.aggregate([
//       { $unwind: "$items" },
//       {
//         $lookup: {
//           from: "products",
//           localField: "items.productId",
//           foreignField: "_id",
//           as: "productDetails"
//         }
//       },
//       { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
//       { $group: { 
//         _id: "$productDetails.category", 
//         totalSold: { $sum: "$items.quantity" } 
//       }},
//       { $sort: { totalSold: -1 } },
//       { $limit: 10 },
//       {
//         $lookup: {
//           from: "categories",
//           localField: "_id",
//           foreignField: "_id",
//           as: "categoryDetails"
//         }
//       },
//       { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
//       { $project: {
//         _id: 1,
//         totalSold: 1,
//         categoryName: { $ifNull: ["$categoryDetails.name", "Unknown Category"] }
//       }}
//     ]);

//     // Aggregate sales data

//     const salesData = await adminController.aggregateSalesData();
//     console.log("Sales data aggregated:", salesData.length);


//     // Process the data for different intervals
//     const dailySalesData = adminController.processDailySalesData(salesData);
//     const weeklySalesData = adminController.processWeeklySalesData(salesData);
//     const monthlySalesData = adminController.processMonthlySalesData(salesData);
//     const yearlySalesData = adminController.processYearlySalesData(salesData);

//   console.log('Daily Sales Data:', dailySalesData);
//   console.log('Weekly Sales Data:', weeklySalesData);
//   console.log('Monthly Sales Data:', monthlySalesData);
//   console.log('Yearly Sales Data:', yearlySalesData);

//     res.render("dashboard", {
//       orders,
//       products,
//       categories,
//       totalRevenue,
//       monthlyRevenue,
//       topSellingProducts,
//       topSellingCategories,
//       salesData,
//       dailySalesData,
//       weeklySalesData,
//       monthlySalesData,
//       yearlySalesData
//     });
//   } catch (error) {
//     console.error("Error loading dashboard:", error);
//     res.status(500).send("Error loading dashboard: " + error.message);
//   }
// },

loadDashboard: async (req, res) => {
  try {
    console.log("Starting loadDashboard");

    const perPage = 10; // Number of items per page
    const currentPage = parseInt(req.query.page) || 1;

    // Fetch total counts for pagination
    const totalProducts = await productModel.countDocuments();
    const totalOrders = await Order.countDocuments({ orderStatus: "Delivered" });

    const products = await productModel
      .find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    const orders = await Order.find({ orderStatus: "Delivered" })
    .sort({ createdOn: -1 }) 
    .skip((currentPage - 1) * perPage)
      .limit(perPage);

    console.log("Products fetched:", products.length);
    console.log("Total delivered orders:", orders.length);

    const categories = await categoryModel.find();

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const recentOrders = await Order.find({
      orderStatus: "Delivered",
      orderDate: { $gte: oneYearAgo }
    });
    console.log("Delivered orders in the last year:", recentOrders.length);

    // Calculate total and monthly revenue
    const totalRevenue = orders.reduce((acc, order) => acc + order.billTotal, 0);
    const currentMonth = moment().month() + 1;
    const currentYear = moment().year();
    const monthlyOrders = orders.filter(order =>
      moment(order.createdOn).month() + 1 === currentMonth &&
      moment(order.createdOn).year() === currentYear
    );
    const monthlyRevenue = monthlyOrders.reduce((acc, order) => acc + order.billTotal, 0);

    // Aggregate Top 10 Best-Selling Products
    const topSellingProducts = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { 
        _id: "$items.productId", 
        name: { $first: "$items.name" },
        totalSold: { $sum: "$items.quantity" } 
      }},
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    // Aggregate Top 10 Best-Selling Categories
    const topSellingCategories = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
      { $group: { 
        _id: "$productDetails.category", 
        totalSold: { $sum: "$items.quantity" } 
      }},
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
      { $project: {
        _id: 1,
        totalSold: 1,
        categoryName: { $ifNull: ["$categoryDetails.name", "Unknown Category"] }
      }}
    ]);

    // Aggregate sales data
    const salesData = await adminController.aggregateSalesData();
    console.log("Sales data aggregated:", salesData.length);

    // Process the data for different intervals
    const dailySalesData = adminController.processDailySalesData(salesData);
    const weeklySalesData = adminController.processWeeklySalesData(salesData);
    const monthlySalesData = adminController.processMonthlySalesData(salesData);
    const yearlySalesData = adminController.processYearlySalesData(salesData);

    console.log('Daily Sales Data:', dailySalesData);
    console.log('Weekly Sales Data:', weeklySalesData);
    console.log('Monthly Sales Data:', monthlySalesData);
    console.log('Yearly Sales Data:', yearlySalesData);

    const totalPages = Math.ceil(totalOrders / perPage);

    res.render("dashboard", {
      orders,
      products,
      categories,
      totalRevenue,
      monthlyRevenue,
      topSellingProducts,
      topSellingCategories,
      salesData,
      dailySalesData,
      weeklySalesData,
      monthlySalesData,
      yearlySalesData,
      currentPage,
      totalPages
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    res.status(500).send("Error loading dashboard: " + error.message);
  }
},


aggregateSalesData: async () => {
  try {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    console.log("Start date for aggregation:", startDate);

    const salesData = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: startDate },
          orderStatus: "Delivered"
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" },
            week: { $week: "$orderDate" },
            day: { $dayOfMonth: "$orderDate" },
          },
          totalSales: { $sum: "$billTotal" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1, "_id.day": 1 },
      },
    ]);

    console.log("Raw sales data:", JSON.stringify(salesData, null, 2));
    return salesData;
  } catch (error) {
    console.error("Error in aggregateSalesData:", error);
    return [];
  }
},

// Process daily sales data
processDailySalesData(salesData) {
  let dailyData = {};

  salesData.forEach((item) => {
    const date = `${item._id.year}-${item._id.month}-${item._id.day}`;

    if (!dailyData[date]) {
      dailyData[date] = 0;
    }
    dailyData[date] += item.totalSales;
  });

  const labels = Object.keys(dailyData);
  const data = Object.values(dailyData);

  return { labels, data };
},

// Process weekly sales data
processWeeklySalesData(salesData) {
  let weeklyData = {};

  salesData.forEach((item) => {
    const week = moment(
      item._id.year + "-" + item._id.month + "-" + item._id.day,
      "YYYY-MM-DD"
    ).isoWeek();
    const year = item._id.year;
    const weekYear = `${year}-W${week}`;

    if (!weeklyData[weekYear]) {
      weeklyData[weekYear] = 0;
    }
    weeklyData[weekYear] += item.totalSales;
  });

  const labels = Object.keys(weeklyData);
  const data = Object.values(weeklyData);

  return { labels, data };
},

// Process monthly sales data
processMonthlySalesData(salesData) {
  let monthlyData = {};

  salesData.forEach((item) => {
    const monthYear = `${item._id.year}-${item._id.month}`;

    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = 0;
    }
    monthlyData[monthYear] += item.totalSales;
  });

  const labels = Object.keys(monthlyData);
  const data = Object.values(monthlyData);

  return { labels, data };
},

// Process yearly sales data
processYearlySalesData(salesData) {
  let yearlyData = {};

  salesData.forEach((item) => {
    const year = item._id.year;

    if (!yearlyData[year]) {
      yearlyData[year] = 0;
    }
    yearlyData[year] += item.totalSales;
  });

  const labels = Object.keys(yearlyData);
  const data = Object.values(yearlyData);

  return { labels, data };
},









  loadProduct: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;  // Default to page 1 if not provided
      const limit = parseInt(req.query.limit) || 5;  // Default to 5 items per page if not provided
      const offset = (page - 1) * limit;
      const total = await productModel.countDocuments();
      const totalPages = Math.ceil(total / limit);
      const products = await productModel.find().skip(offset).limit(limit);

      console.log(products); // Log the products to verify the data
      res.render("products", { 
        products, 
        currentPage: page, 
        totalPages: totalPages, 
        limit: limit 
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  },
  loadaddProductpage : async (req, res) => {
    try {
      const product = await productModel.findById(req.params.id);
      const categories = await categoryModel.find();
      res.render("addProduct", { product,categories });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
    }

  },
 
    
  loadaddProduct: async (req, res) => {
    try {
      const { name, description, author, price, category,stock} = req.body;
      const parsedPrice = parseFloat(price);
      const parsedStock = parseInt(stock);
      const images = [];

      for (const file of req.files) {
        const filename = Date.now() + path.extname(file.originalname);
        const outputPath = path.join(__dirname, '../public/userAssets/imgs/shop', filename);

        await sharp(file.path)
          // .resize(500, 500)
          .toFile(outputPath);

        images.push(filename);

        // Delete the original file uploaded by multer
        // fs.unlinkSync(file.path);
      }

      const productExists = await productModel.findOne({ name, description, author, price:parsedPrice, category ,stock : parsedStock});
      if (productExists) {
        return res.render("addProduct", { message: "Product already exists" });
      }

      const newProduct = new productModel({ name, description, author, price:parsedPrice, category,stock:parsedStock, images });
      await newProduct.save();
      return res.status(200).redirect("/admin/products");
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  },
  loadeditProductpage : async (req, res) => {
    try {
      const product = await productModel.findById(req.params.id);
      const categories = await categoryModel.find();

      res.render("editProduct", { product,categories });

      // res.render("editProduct");
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
    }

  },
  // editProduct: async (req, res) => {
  //   try {
  //     const { name, description, author, price, category,stock,discountPrice } = req.body;
      
  //     const product = await productModel.findById(req.params.id);

  //     if (req.files.length > 0) {
  //       const images = [];

  //       for (const file of req.files) {
  //         const filename = Date.now() + path.extname(file.originalname);
  //         const outputPath = path.join(__dirname, '../public/userAssets/imgs/shop', filename);

  //         await sharp(file.path)
  //           .resize(500, 500)
  //           .toFile(outputPath);

  //         images.push(filename);

  //         // Delete the original file uploaded by multer
  //         // fs.unlinkSync(file.path);
  //       }

  //       product.images = images;
  //     }

  //     product.name = name;
  //     product.description = description;
  //     product.price = parseFloat(price);
  //     product.author = author;
  //     product.category = category;
  //     product.stock = parseFloat(stock);
  //     product.discountPrice = discountPrice;

  //     await product.save();
  //     return res.status(201).redirect('/admin/products');
  //   } catch (error) {
  //     console.error(error.message);
  //     res.status(500).send('Internal Server Error');
  //   }
  // },
//   editProduct: async (req, res) => {
//     try {
//         const { name, description, author, price, category, stock, discountPrice } = req.body;
        
//         const product = await productModel.findById(req.params.id);
//         if (!product) {
//             return res.status(404).send('Product not found');
//         }

//         // Keep existing images
//         const images = req.body.existingImages ? req.body.existingImages : [];
        
//         // Process new images if any
//         if (req.files && req.files.length > 0) {
//             for (const file of req.files) {
//                 const filename = Date.now() + path.extname(file.originalname);
//                 const outputPath = path.join(__dirname, '../public/userAssets/imgs/shop', filename);

//                 await sharp(file.path)
//                     .resize(500, 500)
//                     .toFile(outputPath);

//                 images.push(filename);
//             }
//         }

//         // Update product details
//         product.name = name;
//         product.description = description;
//         product.price = parseFloat(price);
//         product.author = author;
//         product.category = category;
//         product.stock = parseFloat(stock);
//         product.discountPrice = discountPrice;
//         product.images = images; // Save the combined images array

//         await product.save();
//         return res.status(201).redirect('/admin/products');
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send('Internal Server Error');
//     }
// },
editProduct: async (req, res) => {
  try {
      const { name, description, author, price, category, stock, discountPrice, existingImages } = req.body;

      const product = await productModel.findById(req.params.id);
      if (!product) {
          return res.status(404).send('Product not found');
      }

      // Start with existing images
      const images = existingImages ? existingImages : [];

      // Process new images
      if (req.files && req.files.length > 0) {
          for (const file of req.files) {
              const filename = Date.now() + path.extname(file.originalname);
              const outputPath = path.join(__dirname, '../public/userAssets/imgs/shop', filename);

              await sharp(file.path)
                  .resize(500, 500)
                  .toFile(outputPath);

              images.push(filename);
          }
      }

      // Update product details
      product.name = name;
      product.description = description;
      product.price = parseFloat(price);
      product.author = author;
      product.category = category;
      product.stock = parseFloat(stock);
      product.discountPrice = discountPrice;
      product.images = images; // Save the combined images array

      await product.save();
      return res.status(201).redirect('/admin/products');
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
  }
},

  

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      console.log(req.params + "Delete product .................")
      await productModel.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },
  

  loadCategory: async (req, res) => {
    try {
      const category = await categoryModel.find();
      // console.log(category);
      res.render("category", { category : category });
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
  }
    // res.render("category");

  },

  unlistProduct: async (req, res) => {
    try {
      const { id } = req.params;
      
      const product = await productModel.findById(id);
      
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      
      // Toggle the isListed status
      product.isListed = product.isListed === 'Active' ? 'Inactive' : 'Active';
      
      await product.save();
      
      const statusMessage = product.isListed === 'Active' ? 'listed' : 'unlisted';
      return res.status(200).json({ 
        success: true, 
        message: `Product ${statusMessage} successfully`,
        isListed: product.isListed 
      });
    } catch (error) {
      console.error('Error in unlistProduct:', error.message);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  },



















  // loadOrder: async (req, res) => {
  //   res.render("order");
  // },

 
  
  //   addCategory : async (req, res) => {
  //     const { name, description,discount } = req.body;
  //     console.log("dssdsdsdfsdfsdfsdf", req.body);
  //     try {
  //         const newCategory = new categoryModel ({ name, description,discount });
  //         await newCategory.save();
  //         return res.status(200).redirect("/admin/category")
  //     } catch (error) {
  //         console.error(error.message);
  //         res.status(500).send('Internal Server Error rrrr');
  //     }
  // },
  addCategory: async (req, res) => {
    const { name, description, discount } = req.body;
    console.log("Adding category:", req.body);
    try {
        if (!name || !description) {
            return res.status(400).send('Name and description are required');
        }
        const newCategory = new categoryModel({ 
            name, 
            description, 
            discount: discount ? Number(discount) : undefined 
        });
        await newCategory.save();
        return res.status(201).redirect("/admin/category")
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).send('Internal Server Error');
    }
},
  // editCategory : async (req, res) => {
  //   const _id = req.params.id;
  //   const { name, description,discount } = req.body;
  //   console.log("dssdsdsdfsdfsdfsdf", req.body);
  //   try {
  //       await categoryModel.findByIdAndUpdate(_id, { name, description,discount });
  //       return res.status(201).redirect('/admin/category');
  //   } catch (error) {
  //       console.error(error.message);
  //       res.status(500).send('Internal Server Error');
  //   }
  // },
  editCategory: async (req, res) => {
    const _id = req.params.id;
    const { name, description, discount } = req.body;
    console.log("Editing category:", req.body);
    try {
        if (!name || !description) {
            return res.status(400).send('Name and description are required');
        }
        await categoryModel.findByIdAndUpdate(_id, { 
            name, 
            description, 
            discount: discount ? Number(discount) : undefined 
        });
        return res.status(200).redirect('/admin/category');
    } catch (error) {
        console.error('Error editing category:', error);
        res.status(500).send('Internal Server Error');
    }
},

deleteCategory : async (req, res) => {
  const { id } = req.params;
  console.log(req.params + "Delete category .................")
  try {
      await categoryModel.findByIdAndDelete(id);
      return res.status(200).redirect('/admin/category');
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
  }
},

// wrking
// loadUserlist: async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 5;
//     const offset = (page - 1) * limit;

//     const searchQuery = req.query.search || '';
//     const statusFilter = req.query.status || '';

//     const filter = { isAdmin: false };


//     // if (searchQuery) {
//     //   filter.name = { $regex: searchQuery, $options: 'i' }; // Case-insensitive search
//     // }

//     if (searchQuery) {
//       filter.$or = [
//         { name: { $regex: searchQuery, $options: 'i' } },
//         { email: { $regex: searchQuery, $options: 'i' } }
//       ];
//     }

//     if (statusFilter === 'Active') {
//       filter.isBlocked = false;
//     } else if (statusFilter === 'Disabled') {
//       filter.isBlocked = true;
//     }

    


//     const total = await userModel.countDocuments();
//     const totalPages = Math.ceil(total / limit);
//     const userList = await userModel.find(filter).skip(offset).limit(limit);

//     // const userList = await userModel.find({ isAdmin: false }).skip(offset).limit(limit);
//     console.log(userList);
    
//     return res.render("userlist", {
//       userList: userList,
//       currentPage: page,
//       totalPages: totalPages,
//       limit: limit,
//       searchQuery: searchQuery,
//       statusFilter: statusFilter,
//       message: null,
//       messageType: null
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(500).send("Internal server error");
//   }
// },


loadUserlist: async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const searchQuery = req.query.search || '';
    const statusFilter = req.query.status || '';

    const filter = { isAdmin: false };

    if (searchQuery) {
      filter.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    if (statusFilter === 'Active') {
      filter.isBlocked = false;
    } else if (statusFilter === 'Disabled') {
      filter.isBlocked = true;
    }

    const total = await userModel.countDocuments();
    const totalPages = Math.ceil(total / limit);

    // Fetch users with sorting by creation date (latest to oldest) and pagination
    const userList = await userModel.find(filter)
      .sort({ createdAt: -1 })  // Sort by creation date, latest first
      .skip(offset)
      .limit(limit);

    console.log(userList);

    return res.render("userlist", {
      userList: userList,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      searchQuery: searchQuery,
      statusFilter: statusFilter,
      message: null,
      messageType: null
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal server error");
  }
},











  toggleBlockUser: async (req, res) => {
    try {
      const { userId } = req.body;
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.isBlocked = !user.isBlocked;
      await user.save();
      res.json({ isBlocked: user.isBlocked });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.redirect("/admin/adminLogin");
    });
  },

};

module.exports = adminController;


