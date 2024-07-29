const mongoose=require("mongoose")

const userSchema= mongoose.Schema({
    googleId:{
        type:String
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    
    isBlocked:{
        type:Boolean,
        default:false
    },
    createdOn:{
        type:Date
    },
   

    address:[{
        houseName:{
            type:String
        },
        street:{
            type:String

        },

        city:{
            type:String
        },
        state:{
            type:String
        },
        country:{
            type:String
        },
        postalCode:{
            type:Number
        },
        addressType:{
            type:String
        },
        phoneNumber: {
            type: Number,
            // required: true
        },
        type: {
            type: String,
            enum: ['home', 'office']
        }
    
    }],
    cart: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          quantity: { type: Number, default: 1 }
        }
      ],

      wallet: {
        balance: { type: Number, default: 0 },
        transactions: [{
            amount: { type: Number, required: true },
            description: { type: String, required: true },
            type: { type: String, enum: ['Refund', 'Credit', 'Debit'], required: true },
            date: { type: Date, default: Date.now }
        }]
    }
     

});

module.exports  = mongoose.model("User",userSchema);







