const mongoose = require("mongoose");
const transporter = require("../config/nodemailer");
const Meeting = require("../models/Meeting");
const User = require("../models/User");


const MeetingController = {
  async create(req, res) {
    try {
      req.body.hostId = req.user._id;
      req.body.assistants.push(req.user._id); // Must add ID of user who creates the meeting
      const meeting = await Meeting.create(req.body);
      req.body.assistants.forEach(async (id) => {
        await User.findByIdAndUpdate(id, { $push: { meetings: meeting._id }})
      });
      res.status(201).send({ message: "Meeting created", meeting });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async getAll(req, res) {
    try {
      const meetings = await Meeting.find();
      res.send(meetings);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async getByDate(req, res) {
    try {
      const meeting = await Meeting.findOne({ date: req.body.date });
      if (!meeting) {
        return res.status(404).send({ message: 'No meeting found for this timestamp' });
      }
      res.send(meeting);
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

module.exports = MeetingController;
