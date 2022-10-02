import mongoose from "mongoose";
import { Plant } from "./plant.js";

const Schema = mongoose.Schema;

const personalPlantSchema = new Schema({
  plant: { type: Schema.Types.ObjectId, ref: "Plant" },
  nickname: { type: String, trim: true, maxLength: 25 },
  wateringSchedule: {
    type: Number,
    min: 0,
    max: 30,
    default: 7,
  },
  isWatered: {
    type: Boolean,
    default: false,
  },
  nextWater: {
    type: Date,
    default: function () {
      return new Date().setDate(new Date().getDate() + this.wateringSchedule);
    },
  },
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
