var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    campground = require("./models/campground"),
    comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds.js");
const http = require('http'),
      hostname = '127.0.0.1',
      port = 3000,  
      mongoose = require('mongoose');

seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret : "wowo garik",
    resave: false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());   

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next();
})

//CONNECT MONGOOSE
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelpcamp', {useNewUrlParser: true});

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended : true}));

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.get("/index/new",isLoggedIn ,(req, res)=>{
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
app.get("/index/:id/comments/new",isLoggedIn ,(req, res)=>{
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

//register
app.get("/register", (req, res)=>{
    res.render("register");
})

app.post("/register", (req,res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password,(e,user)=>{
        if(e){
            console.log(e);
            res.redirect('/register');
        }
        passport.authenticate("local")(req,res,()=>{
            console.log(user);
            res.redirect("/index");
        });
    });
});

//login
app.get("/login", (req, res)=>{
    res.render("login");
});

app.post('/login', 
  passport.authenticate('local', { 
    successRedirect:'/index',  
    failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/index');
});

app.get("/logout", (req,res)=>{
    req.logout();
    res.redirect("/");
}) 

function isLoggedIn(req,res ,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
    console.log("password incorrect");
}

app.listen(port, hostname, ()=>{
    console.log("yelpcamp server has started");
});
