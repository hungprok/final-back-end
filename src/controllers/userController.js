const User = require('../models/user');

exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.create({ name, email, password })
        return res.status(201).json({ status: "ok", data: user });
    }
    catch (err) {
        return res.status(500).json({ status: "failed", error: err.message });
    }
};

exports.readUser = async (req, res) => {

    try {
        res.status(201).json({ status: "ok", data: req.user });
    }
    catch (err) {
        return res.status(500).json({ status: "failed", error: err.message });
    }
};