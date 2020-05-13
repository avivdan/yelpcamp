const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email:   String,
    name:  String,
    posts : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"post"
        }
    ]
});
module.exports = mongoose.model("user", userSchema);
