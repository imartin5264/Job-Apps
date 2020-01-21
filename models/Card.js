const mongoose = require('mongoose');

const GuiSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    deck:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const Card = mongoose.model('GUI', GuiSchema); 
module.exports = Card;