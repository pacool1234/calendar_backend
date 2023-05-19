const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const userId = {
  type: ObjectId,
  ref: "User",
};

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Please introduce a username"],
    },

    title: {
      type: String,
    },

    bio: {
      type: String,
    },

    email: {
      type: String,
      match: [/.+\@.+\..+/, "Invalid email address format"],
      unique: true,
      required: [true, "Please introduce an email address"],
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
    },

    confirmed: {
      type: Boolean,
    },

    image: String,

    tokens: [
      { type: String },
    ],
  },
  { timestamps: true }
);

userSchema.index({ username: "text" });

userSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.password;
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
