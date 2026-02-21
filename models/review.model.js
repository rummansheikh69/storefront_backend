import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  user: {
    name: {
      type: String,
      required: true,
    },
    _id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
},{timestamps:true});

export const Review = mongoose.model("Review", reviewSchema);
