const TourGuide = require('../models/TourGuide.js');


exports.createTourGuide = async (req, res) => {
    const { name } = req.body;

    try {
        const tourGuide = await TourGuide.create({ name: name })
        return res.status(201).json({ status: "ok", data: TourGuide });
    }
    catch (err) {
        return res.status(500).json({ status: "failed", error: err.message });
    }
}

exports.updateTourGuide = async (req, res) => {
    const id = req.body.id;
    try {
        const tourGuide = await TourGuide.findByIdAndUpdate(id, {name: req.body.name}, {new: true});
        return res.status(200).json({ status: "ok", data: null });
    }
    catch (err) {
        return res.status(500).json({ status: "failed", error: err.message });
    }
}

exports.deleteTourGuide = async (req, res) => {
    const { id } = req.body;
    try {
        await TourGuide.findByIdAndDelete(id)
        return res.status(204).json({ status: "ok", data: null });
    }
    catch (err) {
        return res.status(500).json({ status: "failed", error: err.message });
    }
}

exports.readTourGuide = async (req, res) => {
    const tourGuide = await TourGuide.find();
    return res.status(200).json({ status: "ok", data: tourGuide})
}