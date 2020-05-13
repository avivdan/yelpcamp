var middlewareObj={}
var comment = require("../models/comment"),
    campground = require("../models/campground");

//middleware
middlewareObj.isLoggedIn = (req,res ,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
    console.log("password incorrect");
}
middlewareObj.checkCommentOwnership = (req, res, next)=>{
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id,(e, foundComment)=>{
            if(e){
                res.redirect("back");
            }else{
                 //is the user created the comment?
                if(foundComment.author.id.equals(req.user._id)){
                    //we're in boys
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
        //the campground exist?
        campground.findById(req.params.id,(e, foundCampground)=>{
            if(e){
                res.redirect("back");
            }else{
                 //is the user created the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    //we're in boys
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



module.exports = middlewareObj;