const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// require passport local mongoose ->
const passportLocalMongoose = require("passport-local-mongoose");
// Define user Schema ->
const userSchema = new Schema({
    // define field for user schema !
    email: {
        type: String,
        required: true,
    },
    // we can add more field here ! 
    // name: { type: String, required: true}

    // now we want to add username and password.
    // -> passport local mongoose automaticaly stores the username
    // and passwrod with salt and hashing.

    // we dont need to define username and password
    // due to passport local mongoose.

});

// this is to use passport local mongoose.
// it automatically implement username, salting, hashing, hashed password
userSchema.plugin(passportLocalMongoose);

// export user model->
module.exports = mongoose.model("User", userSchema);
