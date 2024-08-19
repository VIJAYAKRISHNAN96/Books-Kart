const express = require("express");
const path = require('path');
const bodyparser = require('body-parser');
require("dotenv").config();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 4000
const passport=require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./model/userModel'); // Make sure to import your User model
const bcrypt = require('bcrypt');




//    const adminController = require("./controllers/adminController");
const adminRouter = require("./routes/adminRouter");
const userRouter = require("./routes/userRouter");
const session = require("express-session");

const app= express();

// app.use('/userAssets', express.static(path.join(__dirname, 'userAssets')));

 app.set("view engine","ejs")

 mongoose.connect(process.env.MONGO_URL).then(() => console.log('MongoDB connected successfully'))
 .catch(err => console.error('MongoDB connection error:', err));

 
app.use(express.json());
app.use(express.urlencoded({extended:true}));

 app.set("views",[
    path.join(__dirname,"views/admin"),
    path.join(__dirname,"views/user"),
    path.join(__dirname,"views/partials")
 ])
 app.use(express.static(path.join(__dirname,"public")));

//  app.use('/userAssets', express.static(path.join(__dirname, 'userAssets')));

  app.use(
   session({
     secret: 'secret',
     resave: false,
     saveUninitialized: true,
    //  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
     cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
   })
 );
//  app.use(express.json());

app.use((req, res, next) => {
  if (req.session && req.session.user) {
    req.user = req.session.user;
  }
  next();
});





 
// Passport Configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }
    const newUser = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      password: await bcrypt.hash('google_signin_password', 10)       
      
    });
    await newUser.save();
    done(null, newUser);
  } catch (error) {
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

app.use(passport.initialize());
app.use(passport.session());

 app.use((req, res, next) => {
  console.log('Session on every request:', req.session);
   res.locals.user = req.session.user || null;
   next();
 });

app.use("/",userRouter);
app.use("/admin",adminRouter);


app.listen(PORT , ()=>{
   console.log("http://localhost:"+ process.env.PORT ," server running");
})



