var express = require("express");
    router  = express.Router(),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    User = require("../models/user");


//========================================
// AUTH ROUTES
//========================================
router.get("/register", (req, res)=>{
    res.render("register");
})

router.post("/register", (req,res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password,(e,user)=>{
        if(e){
            console.log(e);
            res.redirect('/register');
        }
        passport.authenticate("local")(req,res,()=>{
            console.log(user);
            res.redirect("/index");
        });
    });
});

//login
router.get("/login", (req, res)=>{
    res.render("login");
});

router.post('/login', 
  passport.authenticate('local', { 
    successRedirect:'/index',  
    failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/index');
});

router.get("/logout", (req,res)=>{
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req,res ,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
    console.log("password incorrect");
}

module.exports= router;