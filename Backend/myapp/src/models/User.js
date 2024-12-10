const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
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

UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        const u = await User.find();
        console.log(u);
        throw new Error('Invalid login Email');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid login credentials');
    }
    return user;
}

UserSchema.methods.compare = async function (password) {
    const user = this;
    return await bcrypt.compare(password, user.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;