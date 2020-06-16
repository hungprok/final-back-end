const Tour = require('../models/Tour');
const { deleteOne } = require('./handlerFactory');

exports.createTour = async (req, res) => {
  const { jobTitle, salary, currency, companyName, address, city, jd, jr, benefit, category, status } = req.body;
  console.log(req.body)
  const tour = new Tour({
    jobTitle: jobTitle,
    salary: salary,
    category: category,
    currency: currency,
    companyName: companyName,
    address: address,
    city: city,
    jd: jd,
    jr: jr,
    benefit: benefit,
    status: status,
    owner: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  })
  await tour.save();
  return res.status(200).json({ status: "ok", data: tour })
};

// exports.readTour = catchAsync(async function (req, res) {
//   const filters = { ...req.query };
//   const paginationKeys = ["limit", "page", "sort"];
//   paginationKeys.map(el => delete filters[el]);
//   console.log(filters)
//   const page = req.query.page * 1 || 1;
//   const limit = req.query.limit * 1 || 2;
//   const skip = (page - 1) * limit;

//   try {
//     let query;
//     if (Object.entries(filters).length === 0) {
//       query = await Tour.find()
//       // console.log('filters is empty', query)
//     }
//     else {
//       query = await Tour.find({ filters });
//     }
//     if (req.query.sort) {
//       if (req.query.sort.includes(",")) {
//         const sortBy = req.query.sort.split(",").join(" ")
//         query.sort(sortBy)
//       } else { query.sort(req.query.sort) }
//     };
//     const tours = await query.skip(skip).limit(limit)
//     const countTours =  await tours.countDocuments()
//     if (req.query.page && skip > countTours)
//       return next(new AppError(400, "Page number out of range"))
//     res.json({ status: "success", data: tours });
//   } catch (error) {
//     res.status(400).json({ status: "fail", message: error.message });
//   };
// });

exports.readTour = async (req, res) => {
  try {
    const tours = await Tour.find({ "owner._id": req.user._id });
    // console.log(tours)
    res.json({ status: "success", data: tours.reverse() });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  };
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.body.id);
    const fields = Object.keys(req.body);
    console.log(req.body)
    const newFields = fields.filter(el => el !== 'id')
    newFields.map(field => tour[field] = req.body[field]);
    await tour.save();
    res.status(200).json({ status: "success", data: tour });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  };
};

exports.deleteTour = deleteOne(Tour);
