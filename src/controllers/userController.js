const User = require('../models/user');
const catchAsync = require('../utils/catchAsync')

exports.createUser = async (req, res) => {
    const { name, email, password, type } = req.body;

    try {
        const user = await User.create({ name, email, password, type })
        return res.status(201).json({ status: "ok", data: user });
    }
    catch (err) {
        return res.status(500).json({ status: "failed", error: err.message });
    }
};

exports.readUser = async (req, res) => {
    try {
        return res.status(201).json({ status: "ok", data: req.user });
    }
    catch (err) {
        return res.status(500).json({ status: "failed", error: err.message });
    }
};

exports.readUser2 = catchAsync(
    async (req, res, next) => {
        let data = await Promise.all(
            req.body.map(async (item) => {
                let user = await User.findById(item)
                return { name: user.name, email: user.email, phone: user.phoneNumber, id: user._id }
            }))
        // const newData = await data
        return res.status(201).json({ status: "ok", data: data })
    }
)