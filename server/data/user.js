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
}

module.exports = UserData;