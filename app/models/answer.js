var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AnswerSchema = new Schema({
    type: {type: Number, required: true},
    possibleAnswers: {type: [String], required: true},
    goodAnswer: {type: Number, required: false} //Index of the good answer
});

mongoose.model('Answer', AnswerSchema);