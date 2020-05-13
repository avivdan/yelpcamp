var express = require("express");
    router  = express.Router({mergeParams : true}),
    comment = require("../models/comment"),
    campground = require("../models/campground");


//========================================
// COMMENTS ROUTES
//========================================
router.get("/new",isLoggedIn ,(req, res)=>{
    campground.findById(req.params.id,(e, foundCampground)=>{
        if(e){console.log(e);}else{
            console.log(foundCampground);
            res.render("comments/new", {campground:foundCampground});
        }
     });
});

router.post("/", (req, res)=>{
    //lookup campground using ID
    campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
         comment.create(req.body.comment, (err, comment)=>{
            if(err){
                console.log(err);
            } else {
                campground.comments.push(comment);
                campground.save();
                res.redirect('/index/' + campground._id);
            }
         });
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