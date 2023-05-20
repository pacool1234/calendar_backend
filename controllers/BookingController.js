const mongoose = require("mongoose");
const transporter = require("../config/nodemailer");
const Booking = require("../models/Booking");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const BookingController = {
  async create(req, res) {
    try {
      const bookingExists = await Booking.findOne({ date: req.body.date });
      if (bookingExists) {
        const arrayOfUsers = bookingExists.users;
        if (arrayOfUsers.includes(req.user._id)) {
          return res.send({ message: "You already booked this timestamp", bookingExists });
        }
        const updatedBooking = await Booking.findByIdAndUpdate(bookingExists._id, { $push: { users: req.user._id }}, { new: true });
        return res.send({ message: "You joined this previously created timestamp", updatedBooking });
      }
      req.body.users = [req.user._id] // Add ID of user who books a given time for the 1st time
      const newBooking = await Booking.create(req.body);
      res.send({ message: "Booking created", newBooking });
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
      const booking = await Booking.findById({ _id: bookingId });
      res.send(booking);
    } catch (error) {
      console.error(error);
    }
  },

  async update(req, res) {
    try {
      const bookingId = new mongoose.Types.ObjectId(req.params._id);
      const booking = await Booking.findByIdAndUpdate(bookingId, req.body, {
        new: true,
      });
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
