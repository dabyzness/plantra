import mongoose from "mongoose";
import { Profile } from "./profile.js";

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    img: {
      type: String,
      default: "/assets/images/post.jpg",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export { Post };
