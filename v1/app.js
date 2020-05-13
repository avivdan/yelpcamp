var express = require("express");
var app = express()
var bodyParser = require("body-parser")
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;


var campgrounds = [
    {name: "wow", image:"https://tse1.mm.bing.net/th?id=OIP.dwWWQqte-0C9WFjUzWn8jQHaFj&pid=Api"},
    {name: "swooo", image:"http://i.ytimg.com/vi/V7Xvkjw22T0/maxresdefault.jpg"},
    {name: "kokoko", image:"http://www.trbimg.com/img-5b192b6e/turbine/bs-md-ci-street-view-blog-20180605"}
];




app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");

app.get("/", (req, res)=>{
    res.render("landing");
});

app.get("/campgrounds", (req, res)=>{
   
    res.render("campgrounds",{campgrounds:campgrounds});
});

app.post("/campgrounds", (req,res)=>{
    // get data from the form and add to campground array
    var name=req.body.name;
    var image=req.body.image;
    var newCampground ={ name: name, image:image }
    campgrounds.push(newCampground);
    // redirect to campgrounds page
    res.redirect("campgrounds");
}); 

app.get("/campgrounds/new", (req, res)=>{
    res.render("new")
});

app.listen(port, hostname, ()=>{
    console.log("yelpcamp server has started");
});


