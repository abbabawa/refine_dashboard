import UserModel from "../mongodb/models/user.js";

const getAllUsers = async (req, res) => {};

const createUser = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    const userExists = await UserModel.findOne({ email: email });

    if (userExists) return res.status(200).json(userExists);

    const newUser = await UserModel.create({
      name,
      email,
      avatar,
    });

    res.status(200).json(newUser);
  } catch (err) {
    request.status(500).json({ message: err.message });
  }
};

const getUserInfoById = async (req, res) => {};

export { getAllUsers, getUserInfoById, createUser };
