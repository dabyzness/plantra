import mongoose from "mongoose";
import { Profile } from "./profile.js";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
  data: { type: String, maxLength: 300, required: true },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
  isEdited: { type: Boolean, default: false },
});

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
    likedBy: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export { Post };
