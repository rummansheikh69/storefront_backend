import mongoose, { Schema } from "mongoose";

/**
 * Offer Sub Schema (inside category)
 */
const singleOfferSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  validity: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

/**
 * Category Sub Schema
 */
const categorySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  offers: [singleOfferSchema],
});

/**
 * Main Provider Schema
 */
const providerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    categories: [categorySchema],
  },
  { timestamps: true },
);

export const Offer = mongoose.model("Offer", providerSchema);
