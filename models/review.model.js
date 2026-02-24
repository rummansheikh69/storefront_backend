import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
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
  },
<<<<<<< HEAD
  { timestamps: true },
);
=======
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
},{timestamps:true});
>>>>>>> bbd6c2010b00182f7a742e64d42b3f26e0163aa6

export const Review = mongoose.model("Review", reviewSchema);
