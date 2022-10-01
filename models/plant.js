import mongoose from "mongoose";
import { plantTypes } from "../data/plantTypes.js";

const Schema = mongoose.Schema;

const plantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    scientificName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: plantTypes,
      required: true,
    },
  },
  { timestamps: true }
);

const Plant = mongoose.model("Plant", plantSchema);

export { Plant };
