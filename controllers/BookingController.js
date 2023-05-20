const mongoose = require("mongoose");
const transporter = require("../config/nodemailer");
const Booking = require("../models/Booking");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const BookingController = {
  async create(req, res) {
    try {
      const booking = await Booking.create(req.body);
      res.send(booking);
    } catch (error) {
      console.error(error);
    }
  },

  async getall(req, res) {
    try {
      const bookings = await Booking.find();
      res.send(bookings);
    } catch (error) {
      console.error(error);
    }
  },

  async getbooking(req, res) {
    try {
      const bookingId = new mongoose.Types.ObjectId(req.params._id);
      const booking = await Booking.findById({ _id: bookingId });
      res.send(booking);
    } catch (error) {
      console.error(error);
    }
  },

  async update(req, res) {
    try {
      const bookingId = new mongoose.Types.ObjectId(req.params._id);
      const booking = await Booking.findByIdAndUpdate(bookingId, req.body, { new: true });
      res.send(booking);
    } catch (error) {
      console.error(error);
    }
  },

  async delete(req, res) {
    try {
      const bookingId = new mongoose.Types.ObjectId(req.params._id);
      const booking = await Booking.findByIdAndDelete({ _id: bookingId });
      res.send(booking);
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = BookingController;
