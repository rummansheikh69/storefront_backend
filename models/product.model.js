import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    thumbnailImage: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    inStock: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
    },
    totalReviews: {
      type: Number,
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);
