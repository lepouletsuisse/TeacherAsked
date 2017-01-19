var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StudentAnswerSchema = new Schema({
    answer: {type: String, required: true},
    student: {type: String, required: true},
    date: {type: Date, default: Date.now, required: true}
});

mongoose.model('StudentAnswer', StudentAnswerSchema);