let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    fullName: { 
        type: String, 
        default: '', 
        validate: {
            validator: function(value) {
                return /^[A-Za-zÀ-ỹ\s]+$/.test(value); // Chỉ cho phép chữ cái và dấu tiếng Việt
            },
            message: "Full name should contain only letters."
        }
    },
    avatarUrl: { 
        type: String, 
        default: '', 
        validate: {
            validator: function(value) {
                return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/.test(value);
            },
            message: "Invalid image URL."
        }
    },
    status: { type: Boolean, default: false },
    loginCount: { type: Number, default: 0, min: 0 },
    role: {
        type: mongoose.Types.ObjectId,
        ref: 'role'
    },
    resetPasswordToken: String,
    resetPasswordTokenExp: Date
}, {
    timestamps: true
});

userSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(this.password, salt);
        this.password = hash;
    }
    next();
});

module.exports = mongoose.model('user', userSchema);
