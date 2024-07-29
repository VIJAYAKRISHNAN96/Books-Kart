// const crypto = require('crypto');

// // const Order = require('./model/orderModel'); 
// function verifyPaymentSignature(paymentResponse, razorpaySecret) {
//     const shasum = crypto.createHmac('sha256', razorpaySecret);
//     shasum.update(paymentResponse.order_id + '|' + paymentResponse.payment_id);
//     const digest = shasum.digest('hex');
//     return digest === paymentResponse.signature;
// }

// module.exports = {
//     verifyPaymentSignature
// };


// const crypto = require('crypto');

// const verifyPaymentSignature = (orderId, paymentId, signature) => {
//     const secret = process.env.RAZORPAY_KEY_SECRET;

//     console.log('Razorpay Secret Key:', secret);


//     if (!secret) {
//         throw new Error('Razorpay secret key is not defined');
//     }

//     const hmac = crypto.createHmac('sha256', secret);
//     hmac.update(orderId + "|" + paymentId);
//     const generatedSignature = hmac.digest('hex');

//     return generatedSignature === signature;
// };

// module.exports = { verifyPaymentSignature };

const crypto = require('crypto');

const verifyPaymentSignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  try {
    const secretKey = process.env.RAZORPAY_KEY_SECRET;
    console.log("Razorpay Secret Key inside verifyPaymentSignature:", secretKey);

    if (!secretKey) {
      throw new Error("Razorpay Secret Key is missing.");
    }

    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
    const generatedSignature = hmac.digest('hex');

    console.log("Generated Signature:", generatedSignature);
    console.log("Razorpay Signature:", razorpaySignature);

    return generatedSignature === razorpaySignature;
  } catch (error) {
    console.error("Error in verifyPaymentSignature:", error);
    throw error;
  }
};

module.exports = { verifyPaymentSignature };
