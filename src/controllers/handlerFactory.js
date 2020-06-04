const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = Model => catchAsync(async (req, res) => {
  try {
    const doc = await Model.findOneAndDelete({
      _id: req.body.id,
      user: req.user._id
    });
    if (!doc) return next(new AppError(404, "There is no such item"))
    res.status(204).end();
  } catch (error) {
    next(new AppError(400, error.message))
  };
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.create({
    content: req.body.content,
    tourId: req.body.tourId,
    username: req.user.name,
    rating: req.body.rating,
    user: req.user._id
  });
  res.status(201).json({ status: "success", data: doc })
});

exports.updateOne = (Model, collection) => catchAsync(async (req, res, next) => {
  const doc = await Model.findOne({ _id: req.body.id, user: req.user._id });
  if (!doc)
    return next(new AppError(404, "Document not found"))

  const allows = updateCollectionReducer(collection)
  Object.keys(req.body).map(el => {
    if (allows.includes(el))
      doc[el] = req.body[el];
  });
  await doc.save();
  res.json({ status: "success", data: doc });
})