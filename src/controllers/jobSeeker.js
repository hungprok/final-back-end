const Tour = require('../models/Tour');

exports.jobSeeker = async (req, res) => {
  try {
    const tours = await Tour.find({ "status": true });
    // console.log(tours)
    res.json({ status: "success", data: tours.reverse() });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  };
};

exports.PostCV = async (req, res) => {
  const { file } = req.file
  try {

    if (!file) {
      throw new Error("You need to select a file")
    };
    return res.redirect("/browse");
  } catch (e) {
    return res.render("index", {
      error: e.message
    })
  }
}