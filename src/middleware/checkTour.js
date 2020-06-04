const Tour = require('../models/Tour');

exports.checkTour = async function (req, res, next) {
    const { tourId } = req.body;
    // console.log(req.body);
    try {
        const tour = await Tour.findById(tourId);
        if (!tour) { return res.status(404).json({ status: "fail", message: 'there is no such Tour' }); }
        req.tourId = tourId;
        req.Tourname = Tour.title;
        next();
    }
    catch (err) {
        return res.status(404).json({ status: "fail", message: err.message })
    }
};