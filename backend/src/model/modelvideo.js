const mongoose = require("mongoose");
const validator = require("validator");

const videouplode = new mongoose.Schema({
    videoName: {
        type: String
    },
    videoDescription: {
        type: String,
    },
    characterName: {
        type: String
    },
    URLimg: {
        type: String
    },
    URLvideo:{
        type: String
    },
    id_uploded:{
        type : String
    }
});

const vediouploding = mongoose.model('video', videouplode);

module.exports = vediouploding;
