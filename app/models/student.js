var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StudentSchema = new Schema({
    username : { type: String, required: true, index: {unique: true}},
    token: {type: String, index: {unique: true}, required: true},
    socket: {type: Schema.Types.Mixed, required: false},
    loginTimestamp: {type: Date, required: true, default: Date.now}
});

mongoose.model('Student', StudentSchema);