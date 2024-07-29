




const { ObjectId } = require('mongodb');
const { Schema, model } = require('mongoose');
const objectID = Schema.Types.ObjectId;

const orderSchema = Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
        default: 'Pending',
    },
    items: [{
        productId: {
            type: objectID,
            ref: 'Product'
        },
        name: {
            type: String,
            required: true
        },
        image: [{
            type: String,
            required: true
        }],
        productPrice: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity can not be less than one.'],
            default: 1
        },
        price: {
            type: Number,
        },
        status:{
            type: String,
            enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
            default: 'Pending',
        },
        cancellationReason : {
            type: String,
        },
        cancellationDate : {
            type: Date,
        },
    }],
    billTotal: {
        type: Number,
        required: true
    },
    shippingAddress: {
        houseName:String,
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String,
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Success', 'Failed', 'Refunded'],
        default: 'Pending',
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    orderNotes: {
        type: String,
        default: ''
    },
    cancellationReason: {
        type: String,
        default: ''
    },
    reasonForReturn: {
        default: 'nil',
        type: String
    },
    couponAmount:{
        default: 0,
        type: Number
    },
    couponCode:{
        default: 'nil',
        type: String
    },
    couponId:{
        type:ObjectId,
        ref:'coupon',
       
    },
}, {
    timestamps: true,
});

module.exports = model('Order', orderSchema);







































// // const { ObjectId } = require('mongodb');
// // const { Schema, model } = require('mongoose');
// // const objectID = Schema.Types.ObjectId;

// // const orderSchema = Schema({
// //     orderId: {
// //         type: String,
// //         required: true,
// //         unique: true
// //     },
// //     user: {
// //         type: ObjectId,
// //         ref: 'User',
// //         required: true
// //     },
// //     orderStatus: {
// //         type: String,
// //         enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
// //         default: 'Pending',
// //     },
// //     items: [{
// //         productId: {
// //             type: objectID,
// //             ref: 'Product'
// //         },
// //         name: {
// //             type: String,
// //             required: true
// //         },
// //         image: [{
// //             type: String,
// //             required: true
// //         }],
// //         productPrice: {
// //             type: Number,
// //             required: true
// //         },
// //         quantity: {
// //             type: Number,
// //             required: true,
// //             min: [1, 'Quantity can not be less than one.'],
// //             default: 1
// //         },
// //         price: {
// //             type: Number,
// //         },
// //         status:{
// //             type: String,
// //             enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
// //             default: 'Pending',
// //         },
// //         cancellationReason : {
// //             type: String,
// //         },
// //         cancellationDate : {
// //             type: Date,
// //         },
// //     }],
// //     billTotal: {
// //         type: Number,
// //         required: true
// //     },
// //     shippingAddress: {
// //         houseName:String,
// //         street: String,
// //         city: String,
// //         state: String,
// //         country: String,
// //         postalCode: String,
// //     },
// //     paymentMethod: {
// //         type: String,
// //         required: true
// //     },
// //     paymentStatus: {
// //         type: String,
// //         enum: ['Pending', 'Success', 'Failed', 'Refunded'],
// //         default: 'Pending',
// //     },
// //     orderDate: {
// //         type: Date,
// //         default: Date.now,
// //     },
// //     orderNotes: {
// //         type: String,
// //         default: ''
// //     },
// //     cancellationReason: {
// //         type: String,
// //         default: ''
// //     },
// //     reasonForReturn: {
// //         default: 'nil',
// //         type: String
// //     },
// //     couponAmount:{
// //         default: 0,
// //         type: Number
// //     },
// //     couponCode:{
// //         default: 'nil',
// //         type: String
// //     },
// //     couponId:{
// //         type:ObjectId,
// //         ref:'coupon',
       
// //     },
// // }, {
// //     timestamps: true,
// // });

// // module.exports = model('Order', orderSchema);



// const { ObjectId } = require('mongodb');
// const { Schema, model } = require('mongoose');
// const objectID = Schema.Types.ObjectId;

// const orderSchema = Schema({
//     orderId: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     user: {
//         type: ObjectId,
//         ref: 'User',
//         required: true
//     },
//     orderStatus: {
//         type: String,
//         enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
//         default: 'Pending',
//     },
//     items: [{
//         productId: {
//             type: objectID,
//             ref: 'Product'
//         },
//         name: {
//             type: String,
//             required: true
//         },
//         image: [{
//             type: String,
//             required: true
//         }],
//         productPrice: {
//             type: Number,
//             required: true
//         },
//         quantity: {
//             type: Number,
//             required: true,
//             min: [1, 'Quantity can not be less than one.'],
//             default: 1
//         },
//         price: {
//             type: Number,
//         },
//         status:{
//             type: String,
//             enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
//             default: 'Pending',
//         },
//         cancellationReason : {
//             type: String,
//         },
//         cancellationDate : {
//             type: Date,
//         },
//     }],
//     billTotal: {
//         type: Number,
//         required: true
//     },
//     shippingAddress: {
//         houseName:String,
//         street: String,
//         city: String,
//         state: String,
//         country: String,
//         postalCode: String,
//     },
//     paymentMethod: {
//         type: String,
//         required: true
//     },
//     paymentStatus: {
//         type: String,
//         enum: ['Pending', 'Success', 'Failed', 'Refunded'],
//         default: 'Pending',
//     },
//     orderDate: {
//         type: Date,
//         default: Date.now,
//     },
// }, {
//     timestamps: true,
// });

// module.exports = model('Order', orderSchema);




// // const orderSchema = Schema({
// //     orderId: {
// //         type: String,
// //         required: true,
// //         unique: true
// //     },
// //     user: {
// //         type: Schema.Types.ObjectId,
// //         ref: 'User',
// //         required: true
// //     },
// //     orderStatus: {
// //         type: String,
// //         enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
// //         default: 'Pending',
// //     },
// //     items: [{
// //         productId: {
// //             type: Schema.Types.ObjectId,
// //             ref: 'Product'
// //         },
// //         name: {
// //             type: String,
// //             required: [true, 'Product name is required'] // Custom error message
// //         },
// //         image: [{
// //             type: String,
// //             required: [true, 'Product image is required'] // Custom error message
// //         }],
// //         productPrice: {
// //             type: Number,
// //             required: [true, 'Product price is required'] // Custom error message
// //         },
// //         quantity: {
// //             type: Number,
// //             required: [true, 'Quantity is required'], // Custom error message
// //             min: [1, 'Quantity cannot be less than one.'],
// //             default: 1
// //         },
// //         price: {
// //             type: Number,
// //         },
// //         status: {
// //             type: String,
// //             enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
// //             default: 'Pending',
// //         },
// //         cancellationReason: {
// //             type: String,
// //         },
// //         cancellationDate: {
// //             type: Date,
// //         },
// //     }],
// //     billTotal: {
// //         type: Number,
// //         required: [true, 'Bill total is required'] // Custom error message
// //     },
// //     shippingAddress: {
// //         houseName: {
// //             type: String,
// //             required: [true, 'House name is required'] // Custom error message
// //         },
// //         street: {
// //             type: String,
// //             required: [true, 'Street is required'] // Custom error message
// //         },
// //         city: {
// //             type: String,
// //             required: [true, 'City is required'] // Custom error message
// //         },
// //         state: {
// //             type: String,
// //             required: [true, 'State is required'] // Custom error message
// //         },
// //         country: {
// //             type: String,
// //             required: [true, 'Country is required'] // Custom error message
// //         },
// //         postalCode: {
// //             type: String,
// //             required: [false, 'Postal code is required'] // Custom error message
// //         },
// //     },
// //     paymentMethod: {
// //         type: String,
// //         required: [true, 'Payment method is required'] // Custom error message
// //     },
// //     paymentStatus: {
// //         type: String,
// //         enum: ['Pending', 'Success', 'Failed', 'Refunded'],
// //         default: 'Pending',
// //     },
// //     orderDate: {
// //         type: Date,
// //         default: Date.now,
// //     },
// // }, {
// //     timestamps: true,
// // });

// // module.exports = model('Order', orderSchema);
