import userService from '../services/userService'
const createUser = async (req, res) => {
    try {
        let data = req.body
        if (!data || !data.email || !data.name) {
            return res.status(200).json({
                EC: 400,
                EM: "Input is empty",
                DT: ""
            })
        }
        let response = await userService.createUser(data);
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }

}
const getUser = async (req, res) => {
    try {
        let response = await userService.getUser();
        return res.status(200).json({
            EC: response.EC,
            EM: response.EM,
            DT: response.DT
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EC: 500,
            EM: "Error from server",
            DT: ""
        })
    }
}
module.exports = {
    createUser,
    getUser,
}