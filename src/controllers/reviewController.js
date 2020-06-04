const Review = require('../models/review');
const Tour = require('../models/Tour');

const { createOne } = require("./handlerFactory");
exports.createReview = createOne(Review);

exports.readReview = async function (req, res) {
    const { tourId } = req.body;
    try {

        const tour = await Tour.findById(req.body.tourId).populate('reviews', '-user -__v -createdAt -updatedAt');

        return res.status(200).json({ status: "ok", data: tour });
    }
    catch (err) {
        return res.status(500).json({ status: "failed", error: err.message });
    }
}; 

exports.updateReview = async function (req, res) {
    try {
      // check review & owner 
      const review = await Review.findOne({ _id: req.body.id, user: req.user._id });
      if (!review) return res.status(404).json({ status: "fail", message: "There is no such review" });
      // specify which fields are allowed to be edited
      const allows = ["rating", "content"];
      Object.keys(req.body).forEach(el => {
        if (allows.includes(el))
          review[el] = req.body[el];
      });
      // save
      await review.save();
      res.json({ status: "success", data: review });

    } catch (error) {
      res.status(400).json({ status: "fail", message: error.message });
    };
  };

const { deleteOne } = require("./handlerFactory");
exports.deleteReview = deleteOne(Review);