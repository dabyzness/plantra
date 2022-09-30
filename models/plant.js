import mongoose from "mongoose";

const Schema = mongoose.Schema();

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
  },
  { timestamps: true }
);

const Plant = mongoose.Model("Plant", plantSchema);

export { Plant };
