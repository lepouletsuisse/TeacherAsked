var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    question: {type: String, required: true},
    answer: {type: Schema.Types.ObjectId, ref: 'Answer', required: false},
    isAutocheck: {type: Boolean, required: true}
});

mongoose.model('Question', QuestionSchema);