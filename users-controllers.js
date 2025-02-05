const { validationResult } = require("express-validator");

const HttpError = require("./http-error");
const User = require("./userModel");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Sign up failed, please try again later.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "Email provided is already connected to an account. Please login instead.",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    stats: {
      gamesWon: 0,
      gamesLost: 0,
    },
    winDistribution: {
      oneTry: 0,
      twoTry: 0,
      threeTry: 0,
      fourTry: 0,
      fiveTry: 0,
      sixTry: 0,
    },
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Sign up failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Login failed, please try again later.", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password){
    const error = new HttpError(
        'Invalid credntials, could not login.',
        401
    );
    return next(error);
  }

  res.json({message: 'Logged in!'})
};

exports.signup = signup;
exports.login = login;
