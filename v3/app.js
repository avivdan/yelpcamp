var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    campground = require("./models/campground"),
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
        (e) ? (console.log(e)) : (res.render("index",{campgrounds:allCampgrounds}));
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
    res.render("new")
});

app.get("/index/:id", (req, res)=>{
    campground.findById(req.params.id).populate("comments").exec((e, foundCampground)=>{
       if(e){console.log(e);}else{
           console.log(foundCampground);
           res.render("show", {campground:foundCampground});
       }
    });
});

app.listen(port, hostname, ()=>{
    console.log("yelpcamp server has started");
});

