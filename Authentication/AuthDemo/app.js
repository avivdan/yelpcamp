var express = require("express"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    localStrategy = require("passport-local"),
    User = require('./models/user');
    passportLocalMongoose = require('passport-local-mongoose'),      
    app = express();
const http = require('http'),
      hostname = '127.0.0.1',
      port = 3000,
      mongoose = require('mongoose');

mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/auth_demo', {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended : true}));

app.use(require("express-session")({
    secret : "wowo garik",
    resave: false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());   

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/secret", isLoggedIn, (req, res)=>{
    res.render("secret");
});

//AUTH ROUTES

//register route
app.get("/register", (req, res)=>{
    res.render("register");
});
//register post route
app.post("/register", (req,res)=>{
    User.register(new User({username:req.body.username}),req.body.password,(e, user)=>{
        if(e){
            console.log(e);
            res.render("register");
        }else{
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/secret");
            })
        }
    })
});
//login
app.get("/login", (req, res)=>{
    res.render("login");
});
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/secret');
  });

app.get("/logout", (req,res)=>{
    req.logout();
    res.redirect("/");
}) 

function isLoggedIn(req,res ,next){
    if(req.isAuthenticated){
        return next();
    }
    res.redirect("/login");
    console.log("password incorrect")
}
 
app.listen(port, hostname, ()=>{
    console.log("AuthDemo has started.");
});



