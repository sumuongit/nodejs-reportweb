//**********DEPENDENCIES**********//
const mongoose = require('mongoose');
const bCrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        rquired: true,
        trim: true,
        type: String
    },
    email: {
        required: true,
        unique: true,
        lowercase: true,
        trim: true,        
        type: String
    },
    role: {
        required: true,       
        lowercase: true,
        trim: true,        
        type: String
    },
    hash_password: {
        required: true,
        type: String
    },
    createdAt: {
        default: Date.now,
        type: Date
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
})

userSchema.methods.comparePassword = function(password) {
    return bCrypt.compareSync(password, this.hash_password);
}

module.exports = mongoose.model('User', userSchema);