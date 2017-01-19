var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autopopulate = require('mongoose-autopopulate');

var QuestionSchema = new Schema({
    question: {type: String, required: true},
    answerType: {type: String, required: true},
    possibleMultipleAnswers: {type: [Schema.Types.Mixed]},
    correctMultipleAnswer: {type: Number}, //Index of the good answer
    correctTextAnswer: {type: String},
    isAutocheck: {type: Boolean, required: true},
    studentAnswers: {type: [{type: Schema.Types.ObjectId, ref: 'StudentAnswer'}], autopopulate: true}
});
QuestionSchema.plugin(autopopulate);

mongoose.model('Question', QuestionSchema);