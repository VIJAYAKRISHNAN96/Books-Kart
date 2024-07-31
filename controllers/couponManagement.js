const Coupon = require("../model/couponModel");
const Cart = require("../model/cartModel");


const couponManagement = {

     loadCouponList : async (req, res) => {
        try {
            const coupons = await Coupon.find({}).sort({ createdAt: -1 });
            res.render("coupon", { coupons });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Server error" });
        }
    },

    addCoupon :  async (req, res) => {
        try {
            const { couponName, couponCode, discountAmount, startDate, endDate, status, minimumAmount } = req.body;
    
            // Check if a coupon with the same coupon code already exists
            const existingCouponCode = await Coupon.findOne({ couponcode: couponCode });
            if (existingCouponCode) {
                return res.json({ success: false, message: "Existing coupon" });
            }
    
            // Check if a coupon with the same discount amount already exists
            const existingCouponNameAndAmount = await Coupon.findOne({ discountamount: discountAmount });
            if (existingCouponNameAndAmount) {
                return res.json({ success: false, message: "Existing Discount" });
            }
    
            // Create a new coupon
            const newCoupon = new Coupon({
                couponname: couponName,
                couponcode: couponCode,
                discountamount: discountAmount,
                startDate,
                endDate,
                status,
                minimumamount: minimumAmount
            });
    
            // Save the coupon to the database
            await newCoupon.save();
    
            // Respond with success
            res.json({ success: true, message: 'Coupon added successfully' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },

   

    changeCouponStatus : async (req, res) => {
        try {
            const { couponId } = req.query;
    
            const coupon = await Coupon.findById(couponId);
            if (!coupon) {
                return res.status(404).json({ success: false, message: "Coupon not found" });
            }
    
            coupon.status = coupon.status === 'active' ? 'inactive' : 'active';
            await coupon.save();
            res.status(200).json({ success: true, message: "Status changed successfully" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "Server error" });
        }
    },
    // deleteCoupon : async (req, res) => {
    //     try {
    //         const { couponId } = req.query;
    
    //         const coupon = await Coupon.findById(couponId);
    //         if (!coupon) {
    //             return res.status(404).json({ success: false, message: "Coupon not found" });
    //         }
    
            
    //         res.status(200).json({ success: true, message: "Coupon deleted" });
    //     } catch (error) {
    //         console.log(error.message);
    //         res.status(500).json({ message: "Server error" });
    //     }
    // }
    
    deleteCoupon : async (req, res) => {
        try {
            const { couponId } = req.query;
    
            console.log("Attempting to delete coupon with ID:", couponId); // Log the coupon ID being deleted
    
            // Check if the coupon exists
            const coupon = await Coupon.findById(couponId);
            if (!coupon) {
                console.log("Coupon not found");
                return res.status(404).json({ success: false, message: "Coupon not found" });
            }
    
            // Delete the coupon
            // await Coupon.deleteOne({ _id: couponId });
            await Coupon.findByIdAndDelete(couponId);

            console.log("Coupon deleted successfully");
    
            res.status(200).json({ success: true, message: "Coupon deleted successfully" });
        } catch (error) {
            console.error("Error deleting coupon:", error.message); // Log the error message
            res.status(500).json({ success: false, message: "Server error" });
        }
    },
    

    
    // applyCoupon:async(req,res)=>{
    //     try{
    
    //         const {couponId,subTotal}=req.query;
    //         const coupon=await Coupon.findById(couponId);
    
    //         if(!coupon){
    //             return res.status(404).json({success:false,message:"Coupon not found"})
    //         }
    
    //         if(coupon.status!=="active"){
    //             return res.status(400).json({success:false,message:"Coupon is inactive"});
    //         }
    
    //         const currentDate= new Date();
    
    //         if (currentDate < coupon.startDate) {
    //             return res.status(400).json({ success: false, message: 'Coupon is not yet valid.' });
    //         }
    
    
    //         if(currentDate>coupon.endDate){
    //             return res.status(400).json({success:false,message:"Coupon has expired"})
    //         }
    
    //         if(parseFloat(subTotal) < coupon.minimumamount){
               
    //             return res.status(400).json({ success: false, message: `Minimum order amount should be ${coupon.minimumamount}` });
    //         }
    
    //         const discountAmount = (parseInt(subTotal) * coupon.discountamount/100).toFixed(2);
    //         const differenceAmount=(parseInt(subTotal)- discountAmount)
    
    //         return res.status(200).json({
    //             success:true,
    //             differenceAmount,
    //             discountAmount,
    //             coupon
    //         })
            
    
    
    //     }catch(error){
    //         console.log(error.message);
    //         return res.status(500).json({ success: false, message: 'Internal Server Error' });
    //     }
    // }

    applyCoupon: async (req, res) => {
        try {
            console.log("Received request with query:", req.query);
    
            const { couponId, subTotal } = req.query;
            console.log("Coupon ID:", couponId, "SubTotal:", subTotal);
    
            // Check if subTotal is a valid number
            const parsedSubTotal = parseFloat(subTotal);
            if (isNaN(parsedSubTotal) || parsedSubTotal <= 0) {
                return res.status(400).json({ success: false, message: "Invalid subtotal value." });
            }
    
            const coupon = await Coupon.findById(couponId);
            console.log("Fetched Coupon:", coupon);
    
            if (!coupon) {
                console.log("Coupon not found");
                return res.status(404).json({ success: false, message: "Coupon not found" });
            }
    
            if (coupon.status !== "active") {
                console.log("Coupon is inactive");
                return res.status(400).json({ success: false, message: "Coupon is inactive" });
            }
    
            const currentDate = new Date();
            console.log("Current Date:", currentDate, "Coupon Start Date:", coupon.startDate, "Coupon End Date:", coupon.endDate);
    
            if (currentDate < coupon.startDate) {
                console.log("Coupon is not yet valid");
                return res.status(400).json({ success: false, message: 'Coupon is not yet valid.' });
            }
    
            if (currentDate > coupon.endDate) {
                console.log("Coupon has expired");
                return res.status(400).json({ success: false, message: "Coupon has expired" });
            }
    
            if (parsedSubTotal < coupon.minimumamount) {
                console.log("SubTotal is less than the minimum amount required for the coupon");
                return res.status(400).json({ success: false, message: `Minimum order amount should be ${coupon.minimumamount}` });
            }
    
            // Ensure coupon.discountamount is a valid number
            const discountPercentage = parseFloat(coupon.discountamount);
            if (isNaN(discountPercentage) || discountPercentage <= 0) {
                return res.status(400).json({ success: false, message: "Invalid discount amount in coupon." });
            }
    
            const discountAmount = (parsedSubTotal * discountPercentage / 100).toFixed(2);
            const differenceAmount = (parsedSubTotal - discountAmount).toFixed(2);
    
            console.log("Discount Amount:", discountAmount, "Difference Amount:", differenceAmount);
    
            return res.status(200).json({
                success: true,
                differenceAmount,
                discountAmount,
                coupon
            });
    
        } catch (error) {
            console.log("Error in applyCoupon function:", error.message);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
    
      
      
   
      





    
    
    

}

module.exports = couponManagement