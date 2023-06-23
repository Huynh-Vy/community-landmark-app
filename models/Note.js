const { number } = require("joi");
const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    title : {
        type: String,
        required: true,
        min: 3,
    },
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
    lat: {
        type: Number,
        required: true,
    },
    long: {
        type: Number,
        required: true,
    }
},
{ timestamps: true },
)

module.exports = mongoose.model("Note", NoteSchema);