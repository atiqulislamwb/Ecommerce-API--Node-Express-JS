import User from "../models/UserSchema.js";
import {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} from "../utils/index.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(200).json({ users });
};

export const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    res.status(400).send({ msg: `no user with this id ${req.params.id}` });
  }
  checkPermissions(req.user, user._id);
  res.status(201).json({ user });
};

export const showCurrentUser = async (req, res) => {
  res.status(202).json({ user: req.user });
};

export const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    res.status(403).json({ msg: "Please provide all values" });
  }

  const user = await User.findByIdAndUpdate(
    { _id: req.user.userId },
    { email, name },
    { new: true, runValidators: true }
  );

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(204).json({ user: tokenUser });
};

export const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    res.status(500).json({ msg: "Please provide all values" });
  }

  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    res.status(502).json({ msg: "Invalid Credential" });
  }
  user.password = newPassword;

  await user.save();

  res.status(200).json({ msg: "Success! Password Updated." });
};
