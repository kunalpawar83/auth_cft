const User = require("../models/user.model.js");
const appError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");
const { generateToken } = require("../utils/jwt.js");
const sendEmail = require("../utils/email.js");
const crypto = require("crypto");

exports.Signup = catchAsync(async (req, res, next) => {
  const data = req.body;
  const alreadyUser = await User.findOne({ email: data.emal });
  if (alreadyUser) {
    return next(new appError("Please provide  valid eamil address", 400));
  }
  const user = new User(data);
  const response = await user.save();
  console.log(alreadyUser);
  const payload = {
    id: response.id,
  };
  const token = generateToken(payload);
  res.status(201).json({
    status: "success",
    token,
    message: "User registered successfully!",
    response,
  });
});

exports.Login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError("Please provide email and password!", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(
      new appError("User Not found with this email and password ", 401)
    );
  }
  const payload = {
    id: user.id,
  };
  const token = generateToken(payload);
  res.status(200).json({
    status: "success",
    token,
    user,
    message: "Logged in successfully!",
  });
});

// forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError("User not found", 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  console.log(resetToken);
  const message = `Forgot your password?  this is your token Please copy this token and paste it : ${resetToken}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    const mail = await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 5 min)",
      message,
    });
    res.status(200).json({
      status: "success",
      mail,
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new appError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

// reset password
exports.ResetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new appError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  const payload = {
    id: user.id,
  };
  const token = generateToken(payload);
  res.status(200).json({
    status: "success",
    token,
    message: "Password reset successful!",
  });
});

// get all user
exports.getAllUser = catchAsync(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    status: "true",
    user,
  });
});
