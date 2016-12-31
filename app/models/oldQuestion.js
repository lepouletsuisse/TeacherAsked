var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OldQuestionSchema = new Schema({
    question: {type: Schema.Types.ObjectId, ref: 'Question', required: true},
    studentAnswers: {type: Schema.Types.ObjectId, ref: 'StudentAnswer', required: true},
});

mongoose.model('OldQuestion', OldQuestionSchema);