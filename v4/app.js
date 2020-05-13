var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    campground = require("./models/campground"),
    comment = require("./models/comment"),
    seedDB = require("./seeds.js");
const http = require('http'),
      hostname = '127.0.0.1',
      port = 3000,
      mongoose = require('mongoose');

seedDB();

//CONNECT MONGOOSE
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelpcamp', {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");

app.get("/", (req, res)=>{
    res.render("landing");
});

app.get("/index", (req, res)=>{
    campground.find({},(e,allCampgrounds)=>{
        (e) ? (console.log(e)) : (res.render("campgrounds/index",{campgrounds:allCampgrounds}));
    });
});

app.post("/index", (req,res)=>{
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

app.get("/index/new", (req, res)=>{
    res.render("campgrounds/new");
});

app.get("/index/:id", (req, res)=>{
    campground.findById(req.params.id).populate("comments").exec((e, foundCampground)=>{
       if(e){console.log(e);}else{
           console.log(foundCampground);
           res.render("campgrounds/show", {campground:foundCampground});
       }
    });
});

//========================================
// COMMENTS ROUTES
//========================================
app.get("/index/:id/comments/new", (req, res)=>{
    campground.findById(req.params.id,(e, foundCampground)=>{
        if(e){console.log(e);}else{
            console.log(foundCampground);
            res.render("comments/new", {campground:foundCampground});
        }
     });
});

app.post("/index/:id/comments", (req, res)=>{
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

app.listen(port, hostname, ()=>{
    console.log("yelpcamp server has started");
});
