var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TeacherSchema = new Schema({
    username : { type: String, required: true, index: {unique: true}},
    firstname: { type: String, required: true, trim: true},
    lastname: { type: String, required: true, trim: true},
    password: { type: String, required: true},
    token: {type: String, index: {unique: true}, required: false}
});

mongoose.model('Teacher', TeacherSchema);