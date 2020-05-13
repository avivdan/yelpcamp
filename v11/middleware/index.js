var middlewareObj={}
var comment = require("../models/comment"),
    campground = require("../models/campground");

//middleware
middlewareObj.isLoggedIn = (req,res ,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "please Login first");   
    res.redirect("/login");
}
middlewareObj.checkCommentOwnership = (req, res, next)=>{
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id,(e, foundComment)=>{
            if(e){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }    
}
middlewareObj.checkCampgroundOwnership = (req, res, next)=>{
    if(req.isAuthenticated()){
        campground.findById(req.params.id,(e, foundCampground)=>{
            if(e){
                req.flash("error", "Campground didn't found...404...");
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "To edit or delete the campground you must be the campground author");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "Login first, you must do it manually too.");
        res.redirect("back");
    }    
}



module.exports = middlewareObj;