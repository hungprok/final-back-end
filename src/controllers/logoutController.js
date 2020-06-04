exports.Logout = async function (req, res) {
    console.log(req.headers.authorization);
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      console.log(token);
      req.user.token = req.user.token.filter(el => el !== token);
      await req.user.save();
      res.status(204).json({ status: "successful" });
    } catch (err) {
      res.status(401).json({ status: "fail", message: err.message });
    };
  }

  exports.LogoutAll = async function (req, res) {
    console.log(req.headers.authorization);
    try {
      const token = req.headers.authorization.replace("Bearer ", "");
      console.log(token);
      req.user.token = [];
      await req.user.save();
      res.status(204).json({ status: "successfully logout all devices" });
    } catch (err) {
      res.status(401).json({ status: "fail", message: err.message });
    };
  }