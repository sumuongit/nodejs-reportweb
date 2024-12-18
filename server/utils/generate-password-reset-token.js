const crypto = require('crypto');

const generatePasswordResetToken = async (user) => {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store the hash and expiration in the database
    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    return resetToken;
};

module.exports = generatePasswordResetToken;
