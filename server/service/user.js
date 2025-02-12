const userDataLayer = require('../data/user');
const userData = new userDataLayer();

class UserService {
    async register(user) {
        try {
            const result = await userData.register(user);
            return result;
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async signin(email) {
        try {
            const result = await userData.signin(email);
            return result;
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async forgotPassword(email) {
        try {
            const result = await userData.forgotPassword(email);
            return result;
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async resetPassword({ resetPasswordToken, resetPasswordExpires }) {
        try {
            const result = await userData.resetPassword(
                {
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
            const result = await userData.getUsers();
            return result;
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async update(id, user, options) {
        try {
            const result = await userData.update(id, user, options);
            return result;
        } catch (err) {
            return { success: false, message: err.message };
        }
    }

    async delete(id) {
        try {
            const result = await userData.delete(id);
            return result;
        } catch (err) {
            return { success: false, message: err.message };
        }
    }
}

module.exports = UserService;