const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const userId = {
  type: ObjectId,
  ref: "User",
};

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String
    },

    hostId: {
      type: ObjectId,
      ref: "User"
    },

    date: {
      type: Date,
      default: Date.now
    },

    assistants: [ userId ],
  },
  { timestamps: true }
);

meetingSchema.methods.toJSON = function () {
  const meeting = this._doc;
  return meeting;
};

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;
