var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StudentSchema = new Schema({
    username : { type: String, required: true, index: {unique: true}},
    token: {type: String, index: {unique: true}, required: false}
});

mongoose.model('Student', StudentSchema);