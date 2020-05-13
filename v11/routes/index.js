var express = require("express");
    router  = express.Router(),
    bodyParser = require("body-parser"),
    campground = require("../models/campground"),
    middleware = require("../middleware");

//========================================
// INDEX ROUTES
//========================================
router.get("/", (req, res)=>{
    campground.find({},(e,allCampgrounds)=>{
        (e) ? (console.log(e)) : (res.render("campgrounds/index",{campgrounds:allCampgrounds}));
    });
});

router.post("/", middleware.isLoggedIn, (req,res)=>{
    // get data from the form and add to campground array
    var name=req.body.name;
    var image=req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id : req.user._id, 
        username : req.user.username
    }
    var newCampground = {name:name, image:image, description:description,author:author,price:price}
    campground.create(newCampground,(e,newCamp)=>{
        if(e){
            console.log(e);
        }else{
            req.flash("success", "Campground added successfully");
            res.redirect("/index");
        }
    });
}); 

router.get("/new", middleware.isLoggedIn,(req, res)=>{
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

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=>{
    campground.findById(req.params.id,(e, foundCampground)=>{
        res.render("campgrounds/edit",{campground : foundCampground});
    });
}); 

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership,(req, res)=>{
    //find and update currect campground
    campground.findByIdAndUpdate(req.params.id, req.body.campground, (e, updatedCampground)=>{
        if(e){
            console.log(e);
        }else{
            req.flash("success", "Successfully edited "+req.body.campground.name);
            res.redirect("/index/"+req.params.id);
        }
    });
});

//DESTROY CAMPGROUND ROUTE\
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        var campName = campgroundRemoved.name;
        if (err) {
            console.log(err);
        }
        comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            req.flash("success", "Successfully removed "+campName);
            res.redirect("/index");
        });
    })
});


module.exports= router;