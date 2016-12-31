var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StudentAnswerSchema = new Schema({
    answer: {type: String, required: true},
    student: {type: Schema.Types.ObjectId, ref: 'Student', required: true},
    date: {type: Date, required: true}
});

mongoose.model('StudentAnswer', StudentAnswerSchema);