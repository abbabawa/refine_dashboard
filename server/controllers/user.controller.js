import UserModel from "../mongodb/models/user.js";

const getAllUsers = async (req, res) => {
  try{
    const users = await UserModel.find({}).limit(req.query._end)

    res.status(200).json(users)
  }catch(err){
    res.status(500).json({message: err.message})
  }
};

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

const getUserInfoById = async (req, res) => {
  try{
  const {id} = req.params

  const user = await UserModel.findOne({_id: id}).populate('allProperties')

  if(user) return res.status(200).json(user)

  res.status(404).json({message: 'User not found'})
  }catch(error) {
    res.status(500).json({message: error.message})
  }
};

export { getAllUsers, getUserInfoById, createUser };
