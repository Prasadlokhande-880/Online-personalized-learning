const mongoose = require("mongoose");
const validator = require("validator");

const signupSchematecher = new mongoose.Schema({
    name: {
        type: String
    },
    branch: {
        type: String,
    },
    Experience: {
        type: Number
    },
    ContactNumber: {
        type: String
    },
    Email:{
        type: String
    },
    Password:{
        type: String
    },


    Institution:{
        type: String
    },
    Age:{
        type: String
    },
    Country:{
        type: String
    },
    city:{
        type:String
    },
    pincode:{
        type:Number
    },
    URL:{
        type: String
    }
});

const techer_signup = mongoose.model('Signup', signupSchematecher);

module.exports = techer_signup;
