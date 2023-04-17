const { Router } = require("express");
const { userModel } = require("../../models/users.model");
const { generateToken } = require("../../jwt");
const { hashPassword, isValidPassword } = require("../../hash");

const { authToken } = require("../../middlewares/authToken.middleware");
// const passport = require("../../middlewares/passport.middleware"); //with passportCustom middleware we don´t need to import passport

const {
  passportCustom,
} = require("../../middlewares/passportCustom.middleware");

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  if (!isValidPassword(user, password)) {
    return false;
  }

  const role =
    username === "adminCoder@coder.com" && password === "adminCod3r123"
      ? "admin"
      : "user";

  const access_token = generateToken({user, role});

  //sent token via cookie
  res.cookie("ecomm23", access_token, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
  });

  // res.json({ access_token });
  res.json({ payload: "OK" });
});

router.post("/register", async (req, res) => {
  const { first_name, last_name, age, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "User already exist" });
  }

  const newUser = {
    first_name,
    last_name,
    age,
    email: username,
    password: hashPassword(password),
  };
  await userModel.create(newUser);

  const role =
  username === "adminCoder@coder.com" && password === "adminCod3r123"
    ? "admin"
    : "user";

  const access_token = generateToken({user, role});
  res.json({ access_token });
});

//using passportCustom middleware to be able to manage the errors
router.get(
  "/current",
  passportCustom("jwt"),
  authToken("user"), //"admin" is not going to have authorization
  async (req, res) => {
    res.json({ payload: req.user });
  }
);

// router.get(
//   "/current",
//   passport.authenticate("jwt", { session: false }), //we are not using sessions, so we have to turn it off
//   async (req, res) => {
//     res.json({ payload: req.user });
//   }
// );

//with JWT we don´t need the authToken middleware
// router.get("/current", authToken, async (req, res) => {
//   res.json({ payload: req.user });
// });

module.exports = router;
