const mongoose = require("mongoose");
var post = require("./models/post");
var User = require("./models/user");

mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/blog_Demo_2', {useNewUrlParser: true});

var Schema = mongoose.Schema;

//POST - TITLE, BODY
// var postSchema = new Schema({
//     title:   String,
//     content:  String
// });

// var post = mongoose.model("post", postSchema);


//USER - EMAIL, NAME
// var userSchema = new Schema({
//     email:   String,
//     name:  String,
//     posts : [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref:"post"
//         }
//     ]
// });
// var User = mongoose.model("user", userSchema);

User.create({
    name : "trooper troopy",
    email:"trooper@USA.org.us"
});


post.create({
    title:"The troopy troopers",
    content:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.    "
},(e,post)=>{
    if(e){
        console.log(e);
    }else{
        User.findOne({name:"trooper troopy"},(e,foundUser)=>{
            if(e){
                console.log(e);
            }else{
                foundUser.posts.push(post);
                foundUser.save((e,data)=>{
                    if(e){
                        console.log(e);
                    }else{
                        console.log(data);
                    }
                });
            }
        });
    }
});




User.findOne({name:"trooper troopy"}).populate("posts").exec((e,user)=>{
    (e)?(console.log(e)):(console.log(user));
});