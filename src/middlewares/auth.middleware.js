const auth = async (req, res, next) => {
  const user = await req.session.user;
  if (user) {
    next();
  } else {
    res.redirect("/");
  }
};

module.exports = {
  auth,
};
