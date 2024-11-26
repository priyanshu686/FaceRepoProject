const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    rollNo: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    img: {
        type: String,
        trim: true,
        default: ''
    },
    faceData: {
        type: Object,
        default: {}
    },
    attendance: {
        type: [Object],
        default: []
    },
}, {
    timestamps: true,
    versionKey: false,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;