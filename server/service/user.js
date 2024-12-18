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
}

module.exports = UserService;