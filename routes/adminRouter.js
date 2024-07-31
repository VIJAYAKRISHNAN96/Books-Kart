const express = require("express");
const adminRouter = express.Router();
const path = require('path');
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const couponManagement= require("../controllers/couponManagement");
const salesReportManagement = require("../controllers/salesReportManagement");

    


const auth=require("../middlewares/adminAuth");

const multer = require('multer'); 
const orderManagement = require("../controllers/orderManagement");


// const { salesReportManagement } = require("../controllers/salesReportManagement");



// Set up multer for file uploads
const storage = multer.diskStorage({    
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/userAssets/imgs/shop')); // Path to the uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique filenames
    }
});

// const upload = multer({ storage: storage });
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 10 * 1024 * 1024,
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
        files: 10 // limit to 3 files
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed"));
        }
    }
});

module.exports = upload;

adminRouter.get("/adminlogin", auth.isLogOut, adminController.loadAdminLogin);
adminRouter.post("/adminLogin", adminController.processAdminLogin);
adminRouter.get("/logout", adminController.logout);
adminRouter.get("/dashboard", auth.isLogin, adminController.loadDashboard);
adminRouter.get("/products", adminController.loadProduct);
adminRouter.get("/addProduct", adminController.loadaddProductpage);
// adminRouter.post('/addProduct', upload.array('images', 3), adminController.addProduct);
adminRouter.post('/addProduct', upload.array('images', 3), adminController.loadaddProduct);

// adminRouter.post("/addProduct",adminController.addProduct);

 // Ensure this is correct
adminRouter.get('/editProduct/:id', adminController.loadeditProductpage);
adminRouter.post('/editProduct/:id', upload.array('images', 3), adminController.editProduct);
adminRouter.get('/deleteProduct/:id', adminController.deleteProduct);
adminRouter.get("/category", adminController.loadCategory);
adminRouter.post('/category/edit/:id', adminController.editCategory);
adminRouter.post('/category/delete/:id', adminController.deleteCategory);
adminRouter.get("/userlist", adminController.loadUserlist);
adminRouter.post('/toggleBlockUser', adminController.toggleBlockUser);
adminRouter.post('/category/create', adminController.addCategory);

adminRouter.get("/order", auth.isLogin,orderManagement.loadOrder);
adminRouter.put("/changeOrderStatus", auth.isLogin,orderManagement.changeOrderStatus);
adminRouter.get("/orderDetails", auth.isLogin,orderManagement.loadOrderDetails);


adminRouter.get('/coupon', couponManagement.loadCouponList);
adminRouter.post('/addCoupon', couponManagement.addCoupon);
adminRouter.put('/couponStatus', couponManagement.changeCouponStatus);
adminRouter.delete('/deleteCoupon', couponManagement.deleteCoupon);



adminRouter.get("/salesReport",auth.isLogin,salesReportManagement.loadSalesReport);
adminRouter.get("/filterReport",auth.isLogin,salesReportManagement.filterSalesReport);
adminRouter.get("/downloadPdf",auth.isLogin,salesReportManagement.downloadPDF);
adminRouter.get("/downloadExcel",auth.isLogin,salesReportManagement.downloadExcel);















module.exports = adminRouter;
// module.exports= orderManagement


// adminRouter.get("/adminlogin",auth.isLogOut,adminController.loadAdminLogin);
// adminRouter.post("/adminLogin",adminController.processAdminLogin);
// adminRouter.get("/logout",adminController.logout);
// adminRouter.get("/dashboard",auth.isLogin,adminController.loadDashboard);
// adminRouter.get("/products",adminController.loadProduct);
// adminRouter.get("/addProduct",adminController. loadaddProductpage);
// // adminRouter.post("/addProduct",adminController.addProduct);
// adminRouter.post('/addProduct', upload.array('images', 3), adminController.loadaddProduct);
// adminRouter.get('/editProduct/:id', adminController.loadeditProductpage);
// adminRouter.post('/editProduct/:id', upload.array('images', 3), adminController.editProduct);
// adminRouter.get('/deleteProduct/:id', adminController.deleteProduct);

// adminRouter.get("/category",adminController.loadCategory);
// // adminRouter.post('/catagory/add', adminController.addCategory);
// adminRouter.post('/category/edit/:id', adminController.editCategory);
// adminRouter.post('/category/delete/:id', adminController.deleteCategory);
// adminRouter.get("/userlist",adminController.loadUserlist);
// adminRouter.post('/toggleBlockUser', adminController.toggleBlockUser);

// adminRouter.post('/category/create',adminController.addCategory);

// adminRouter.get("/order", auth.isLogin,orderManagement.loadOrder);
// adminRouter.put("/changeOrderStatus", auth.isLogin,orderManagement.changeOrderStatus);
// // adminRouter.get("/orderDetails", auth.isLogin,orderManagement.loadOrderDetails);



       
        
// module.exports = adminRouter