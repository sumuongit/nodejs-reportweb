const usermodel = require('../model/user');

class UserData {
    async register(user) {
        try {
            const result = await user.save();
            return result;
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async signin(email) {
        try {
            const result = await usermodel.findOne(email);
            return result;
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async forgotPassword(email) {
        try {
            const result = await usermodel.findOne(email);
            return result;
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async resetPassword({ resetPasswordToken, resetPasswordExpires }) {
        try {
            const result = await usermodel.findOne({
                resetPasswordToken: resetPasswordToken,
                resetPasswordExpires: resetPasswordExpires
            }
            );
            return result;
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async getUsers() {
        try {
            const result = await usermodel.find().sort({ date: 'desc' });
            return { success: true, data: result };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async update(id, user, options) {
        try {
            const result = await usermodel.findByIdAndUpdate(id, user, options);
            return { success: true, data: result };
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async delete(id) {
        try {
            const result = await usermodel.findByIdAndDelete(id);
            return result;
        } catch (err) {
            return { success: false, message: err.message };
        }
    }
}

module.exports = UserData;