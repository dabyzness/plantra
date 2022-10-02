import mongoose from "mongoose";
import { Plant } from "./plant.js";

const Schema = mongoose.Schema;

const noteSchema = new Schema(
  {
    action: {
      type: String,
      default: "Watered",
      required: true,
    },
    info: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const personalPlantSchema = new Schema(
  {
    plant: { type: Schema.Types.ObjectId, ref: "Plant" },
    nickname: { type: String, trim: true, maxLength: 25 },
    wateringSchedule: {
      type: Number,
      min: 0,
      max: 28,
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
    notes: [noteSchema],
  },
  { timestamps: true }
);

const profileSchema = new Schema(
  {
    name: String,
    avatar: String,
    username: {
      type: String,
      minLength: 3,
      maxLength: 25,
      lowercase: true,
      unique: true,
    },
    plants: [personalPlantSchema],
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

export { Profile };
