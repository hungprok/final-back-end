const Cate = require('../models/Cate');

exports.createCate = async (req, res) => {
    const { Catename } = req.body;

    try {
        const cate = await Cate.create({ Cate: Catename })
        return res.status(201).json({ status: "ok", data: cate });
    }
    catch (err) {
        return res.status(500).json({ status: "failed", error: err.message });
    }
};

exports.readCate = async (req, res) => {
    const cate = await Cate.find();
    return res.status(200).json({ status: "ok", data: cate})
}