const mongoose = require("mongoose");
const transporter = require("../config/nodemailer");
const Booking = require("../models/Booking");
const User = require("../models/User");
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
        await User.findByIdAndUpdate(req.user._id, { $push: { bookings: bookingExists._id }})
        return res.send({ message: "You joined this previously created timestamp", updatedBooking });
      }
      req.body.users = [req.user._id] // Must add ID of user who books a given time for the 1st time
      const newBooking = await Booking.create(req.body);
      await User.findByIdAndUpdate(req.user._id, { $push: { bookings: newBooking._id }})
      res.status(201).send({ message: "Booking created", newBooking });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async getall(req, res) {
    try {
      const bookings = await Booking.find();
      res.send(bookings);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async getbooking(req, res) {
    try {
      const bookingExists = await Booking.findOne({ date: req.body.date });
      if (!bookingExists) {
        return res.status(404).send({ message: 'No booking found for this timestamp' });
      }
      res.send(bookingExists);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async delete(req, res) {
    try {
      const regex = /(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}).*/;
      const match = req.body.date.match(regex);
      const [ _, date, time ] = match

      const booking = await Booking.findOne({ date: req.body.date });
      await User.findByIdAndUpdate(req.user._id, { $pull: { bookings: booking._id }})
      const arrayOfUsers = booking.users;
      if (arrayOfUsers.length === 1 && arrayOfUsers.includes(req.user._id)) {
        await Booking.findByIdAndDelete(booking._id);
        return res.send({ message: `You cancelled your booking on ${date} @ ${time}` });
      }
      const filteredArrayOfUsers = arrayOfUsers.filter(id => !id.equals(req.user._id)); // use the equals method provided by mongoose ObjectId
      console.log(filteredArrayOfUsers);

      await Booking.findByIdAndUpdate(booking._id, { users: filteredArrayOfUsers }, { new: true });
      res.send({ message: `You cancelled your booking on ${date} @ ${time}` });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
};

module.exports = BookingController;
