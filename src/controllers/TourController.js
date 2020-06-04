const Tour = require('../models/Tour');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createTour = async (req, res) => {
  const { title, cate, tourguide, groupSize, price } = req.body;

  const tour = new Tour({
    tourguide: tourguide,
    cate: cate,
    title: title,
    owner: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email
    },
    groupSize: groupSize,
    price: price
  })
  await tour.save();
  return res.status(200).json({ status: "ok", data: tour })
};

exports.readTour = catchAsync(async function (req, res) {
  const filters = { ...req.query };
  const paginationKeys = ["limit", "page", "sort"];
  paginationKeys.map(el => delete filters[el]);
  console.log(filters)
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 2;
  const skip = (page - 1) * limit;

  try {
    let query;
    if (Object.entries(filters).length === 0) {
      query = await Tour.find()
      // console.log('filters is empty', query)
    }
    else {
      query = await Tour.find({ filters });
    }
    console.log(filters)
    if (req.query.sort) {
      if (req.query.sort.includes(",")) {
        const sortBy = req.query.sort.split(",").join(" ")
        query.sort(sortBy)
      } else { query.sort(req.query.sort) }
    };
    const tours = await query
    // .skip(skip).limit(limit)
    // const countTours =  await tours.countDocuments()
    // if (req.query.page && skip > countTours)
    //   return next(new AppError(400, "Page number out of range"))
    res.json({ status: "success", data: tours });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  };
});

// exports.readTour = async (req, res) => {

//   try {
//     const Tours = await Tour.find({ "owner._id": req.user._id });
//     res.json({ status: "success", data: Tours });
//   } catch (error) {
//     res.status(400).json({ status: "fail", message: error.message });
//   };
// };

exports.updateTour = async (req, res) => {

  try {
    const Tour = await Tour.findById(req.body.id);
    const fields = Object.keys(req.body);

    // eliminate id field, actually, it's okay if u leave it there 'cause it's the same id
    const newFields = fields.filter(el => el !== 'id')
    newFields.map(field => Tour[field] = req.body[field]);
    await Tour.save();
    res.status(200).json({ status: "success", data: Tour });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  };
};