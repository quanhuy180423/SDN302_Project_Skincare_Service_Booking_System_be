import { User } from "../models";

const createUser = async (data) => {
    try {
        console.log(data);
        let user = await User.create(data);
        return {
            EC: 200,
            EM: "Success",
            DT: user
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: ""
        }
    }
}
const getUser = async () => {
    try {
        let user = await User.find();
        return {
            EC: 200,
            EM: "Success",
            DT: user
        }
    } catch (error) {
        console.log(error);
        return {
            EC: 500,
            EM: "Error from server",
            DT: ""
        }
    }
}
module.exports = {
    createUser,
    getUser,
}