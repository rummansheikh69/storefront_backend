import mongoose, { Schema } from "mongoose";

const digitalProductSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

export const DigitalProduct = mongoose.model(
  "DigitalProduct",
  digitalProductSchema,
);
