import mongoose from "mongoose";
import { Plant } from "./plant.js";

const Schema = mongoose.Schema;

const personalPlantSchema = new Schema({
  plant: { type: Schema.Types.ObjectId, ref: "Plant" },
  nickname: { type: String, trim: true, maxLength: 25 },
});

const profileSchema = new Schema(
  {
    name: String,
    avatar: String,
    plants: [personalPlantSchema],
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

export { Profile };
