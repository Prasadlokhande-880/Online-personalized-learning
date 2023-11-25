const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcrypt');

const signupSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email address'
        }
    },
    phoneNumber: {
        type: Number
    },
    password: {
        type: String
    },
    Country:{
        type: String
    },
    Profession:{
        type: String
    },
    Institution:{
        type: String
    },
    Teams_List:{
        type: String
    },
    Team_Invites:{
        type: String
    },
    Discuss_Profile:{
        type: String
    },
    CodeChef_Pro_Plan:{
        type: String
    },
    URL:{
        type: String
    }
});

const student_signup = mongoose.model('StudentSignup', signupSchema);

module.exports = student_signup;
