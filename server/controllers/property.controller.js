import UserModel from "../mongodb/models/user.js";
import PropertyModel from "../mongodb/models/property.js";

import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllProperties = async (req, res) => {
  const { _end, _order, _start, _sort, _title_like="", propertyType="" } = req.query

  const query = {}

  if (propertyType !== '') {
    query.propertyType = propertyType
  }

  if(_title_like){
    query.title = { $regex: title_like, $options: 'i'};
  }

  try{
    const count = await PropertyModel.countDocuments({query});
    const properties = await PropertyModel
    .find(query)
    .limit(_end)
    .skip(_start)
    .sort({[_sort]: _order})

    res.header('x-total-count', count);
    res.header('Access-Control-Expose-Headers', 'x-total-count');


    res.status(200).json(properties)
  }catch(e){
    res.status(500).json({message: e.message});
  }
};

const createProperty = async (req, res) => {
  try {
    const { title, description, propertyType, location, price, photo, email } =
      req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await UserModel.findOne({ email }).session(session);

    if (!user) throw new Error("User not found");

    const photoUrl = await cloudinary.uploader.upload(photo);
    const newProperty = await PropertyModel.create({
      title,
      description,
      propertyType,
      location,
      price,
      photo: photoUrl.url,
      creator: user._id,
    });

    user.allProperties.push(newProperty._id);
    await user.save({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "Property created successfully" });
  } catch (err) {console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const getPropertyDetail = async (req, res) => {
  const {id} = req.params
  const propertyExists = await PropertyModel.findOne({_id: id}).populate('creator')
  if (propertyExists) res.status(200).send(propertyExists); else res.status(404).send({message: 'Property not found'}) 
};

const updateProperty = async (req, res) => {};

const deleteProperty = async (req, res) => {
  try{
    const {_id} = req.params

    const propertyToDelete = await PropertyModel.findById({_id: id}).populate('creator')

    if(!propertyToDelete) throw new Error("Property not found")

    const session = await mongoose.startSession()
    session.startTransaction()

    propertyToDelete.remove({session})
    propertyToDelete.creator.allProperties.pull(propertyToDelete);

    await propertyToDelete.creator.save({session})
    await session.commitTransaction();
    res.status(200).json({message: 'Property was deleted successfully'})
  }catch(err){
    res.status(500).json({message: err.message})
  }
};

export {
  getAllProperties,
  getPropertyDetail,
  createProperty,
  deleteProperty,
  updateProperty,
};
