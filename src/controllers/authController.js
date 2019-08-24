import {successResponse} from '../utils/response';
import {User} from '../models';

const authController = {
    register: async (req, res) => {
        const {userName, email, password} = req.body;

        const user = await User.create({userName, email, password});
        const token = await user.getToken();

        return successResponse(res, {
            token,
            user
        });
    },

    login: async (req, res) => {
        const {user} = req;

        const token = await user.getToken();

        return successResponse(res, {
            token,
            user
        });
    },

    getMe: async ({user}, res) => successResponse(res, {
        user
    }),
};

export default authController;