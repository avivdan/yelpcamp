var express = require("express");
    router  = express.Router({mergeParams : true}),
    comment = require("../models/comment"),
    campground = require("../models/campground"),
    middleware = require("../middleware");


//========================================
// COMMENTS ROUTES
//========================================
router.get("/new", middleware.isLoggedIn,(req, res)=>{
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
            res.redirect("/index");
        } else {
         comment.create(req.body.comment, (err, comment)=>{
            if(err){
                console.log(err);
            } else {
                //add user name + id to username comment var
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                campground.comments.push(comment);
                campground.save();
                req.flash("success", "Successfully added comment to "+campground.name);
                res.redirect('/index/' + campground._id);
            }
         });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req,res)=>{
    comment.findById(req.params.comment_id,(e,foundComment)=>{
        if(e){
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id:req.params.id, comment:foundComment});
        } 
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, (req,res)=>{
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (e, updatedComment)=>{
        if(e){
            console.log(e);
        }else{
            req.flash("success", "Successfully edited comment");
            res.redirect("/index/"+req.params.id);
        }
    });
});

//comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req,res)=>{
    comment.findByIdAndRemove(req.params.comment_id, (e)=>{
        if(e){
            res.redirect("back");
        }else{
            req.flash("success", "Successfully delete comment");
            res.redirect("/index/"+req.params.id);
        }
    })
});

module.exports= router;