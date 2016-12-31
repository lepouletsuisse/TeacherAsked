var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    questionType: {type: String, required: true},
    question: {type: String, required: true},
    answer: {type: Schema.Types.ObjectId, ref: 'Answer', required: false}
});

mongoose.model('Question', QuestionSchema);