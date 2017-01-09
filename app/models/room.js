var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment'),
    autopopulate = require('mongoose-autopopulate');

var RoomSchema = new Schema({
    roomId: {type: Number, required: true, index: {unique: true}},
    className: {type: String, required: true},
    numberParticipants: {type: Number, required: true},
    date: {type: Date, required: true, default: Date.now},
    students: {type: [{type: Schema.Types.ObjectId, ref: 'Student'}]},
    teacher: {type: Schema.Types.ObjectId, ref: 'Teacher', required: true, autopopulate: true},
    questions: {type: [{type: Schema.Types.ObjectId, ref: 'Question'}]},
    isOpen: {type: Boolean, required: true, default: true}
});
RoomSchema.plugin(autopopulate);

RoomSchema.plugin(autoIncrement.plugin, {
    model: 'Room',
    field: 'roomId',
    startAt: '1000',
    incrementBy: 1
})

mongoose.model('Room', RoomSchema);