// condition for using dotenv when 
// the enviroment value is not equal to "production".
// we use dotenv only in development stage ! 
if(process.env.NODE_ENV != "production") {
    // require dotenv 
    require("dotenv").config();
};


// basic code for project ! backend!
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// we dont need to require ejs. -> it is part of node.js
// require path
const path = require("path");
const { assert } = require("console");
// require method override function
const methodOverride = require("method-override");
// require ejs mate ->
const ejsMate = require("ejs-mate");
// require ExpressError Class ->
const ExpressError = require("./utils/ExpressError.js");

// require listing.js from routes
const listingsRouter = require("./routes/listing.js");
// require review.js from routes
const reviewsRouter = require("./routes/review.js");
// require user.js from routes
const usersRouter = require("./routes/user.js");

// require Express session 
const session = require("express-session");
// require connect-mongo
const MongoStore = require('connect-mongo');

// require falsh ! 
const flash = require("connect-flash");

// require passport ! 
const passport = require("passport");
// require local strategy.
const LocalStrategy = require("passport-local");
// require user model 
const User = require("./models/user.js");




// to use static files ->
app.use(express.static(path.join(__dirname,"/public")));

// for connecting database -> 
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// connecting with mongo atlas ->
const DB_URL = process.env.ATLASDB_URL;


// to call main function ->
main()
.then(()=>{
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(DB_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
// to parse the data sent in the form of url.
app.use(express.urlencoded({extended: true}));

// method override ->
app.use(methodOverride("_method"));

// setting engine for ejs 
app.engine("ejs", ejsMate);

// create mongo store
const store = MongoStore.create({
    mongoUrl: DB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

// function on mongo store
store.on("error", ()=>{
    console.log("ERROR in MONGO SESSION STORE ", err)
});

// create session options.
const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days time in milli sec
        maxAge:   7 * 24 * 60 * 60 * 1000,
        // by default
        httpOnly: true,
    },

};


// to use session. (this is a middleware)
app.use(session(sessionOptions));

// we use flash after session. 
app.use(flash());

// to implement passport we need session.
// we implement passport just after session in the code !
app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
// to store user related information in session -> serializeUser
passport.serializeUser(User.serializeUser());
// to de-store user related information in session -> deserializeUser
passport.deserializeUser(User.deserializeUser());


// middleware for flash !
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});



// user route ! 
// app.get("/demouser", async(req,res)=>{
//     // create demo user 
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     // to store this user we will use rgister method !
//     // 2nd parameter of this method is password ! 
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);

// });






// API ROUTES -> with Express Router
// listing Routes
app.use("/listings", listingsRouter);
// Review Routes
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);




// Standard response for  undefined routes !
app.all("*", (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})


// custom error handler !
app.use((err, req, res, next) => {
    // using ExpressError class
    let{statusCode=500, message="Something Went Wrong"} = err; 
    // res.status(statusCode).send(message);
    res.status(statusCode).render("./listings/error.ejs", {err});
});





let port = 8080;
app.listen(port, ()=>{
    console.log(`server is listening to port ${port}`);
});

