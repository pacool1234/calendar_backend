const mongoose = require("mongoose");
const ObjectId = mongoose.SchemaTypes.ObjectId;

const userId = {
  type: ObjectId,
  ref: "User",
};

const bookingSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now
    },
    users: [ userId ],
  },
  { timestamps: true }
);

bookingSchema.methods.toJSON = function () {
  const booking = this._doc;
  return booking;
};

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
