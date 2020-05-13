var express = require("express");
    router  = express.Router(),
    campground = require("../models/campground");


//========================================
// INDEX ROUTES
//========================================
router.get("/", (req, res)=>{
    campground.find({},(e,allCampgrounds)=>{
        (e) ? (console.log(e)) : (res.render("campgrounds/index",{campgrounds:allCampgrounds}));
    });
});

router.post("/", (req,res)=>{
    // get data from the form and add to campground array
    var name=req.body.name;
    var image=req.body.image;
    var descripsion = req.body.descripsion;
    campground.create({
        name:name,
        image :image,
        descripsion : descripsion
        },(e,campground)=>{
            (e)?(console.log("error occourd")):(res.redirect("/index") ,console.log(campground));
        });
}); 

router.get("/new",isLoggedIn ,(req, res)=>{
    res.render("campgrounds/new");
});

router.get("/:id", (req, res)=>{
    campground.findById(req.params.id).populate("comments").exec((e, foundCampground)=>{
       if(e){console.log(e);}else{
           console.log(foundCampground);
           res.render("campgrounds/show", {campground:foundCampground});
       }
    });
});

function isLoggedIn(req,res ,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
    console.log("password incorrect");
}


module.exports= router;