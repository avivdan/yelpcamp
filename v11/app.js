var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    campground = require("./models/campground"),
    flash = require("connect-flash"),
    comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds.js");
const http = require('http'),
      hostname = '127.0.0.1',
      port = 3000,  
      mongoose = require('mongoose');

var commentsRoutes = require("./routes/comments"),
    indexRoutes    = require("./routes/index"),
    authRoutes     = require("./routes/auth");

seedDB();
app.use(flash());
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret : "wowo garik",
    resave: false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());   
app.use(methodOverride("_method"));
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//CONNECT MONGOOSE
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelpcamp', {useNewUrlParser: true});

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended : true}));

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");

app.get("/", (req, res)=>{
    res.render("landing");
});

app.use("/index", indexRoutes);
app.use("/index/:id/comments", commentsRoutes);
app.use(authRoutes);

app.listen(port, hostname, ()=>{
    console.log("yelpcamp server has started");
});
