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
            req.flash("error", e.message);//
            console.log(e);
            res.redirect('/register');
        }
        passport.authenticate("local")(req,res,()=>{
            console.log(user);
            req.flash("success", "Hey there " + newUser.username);
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
    req.flash("success", "Logged out successfully");
    res.redirect("/");
});

module.exports= router;