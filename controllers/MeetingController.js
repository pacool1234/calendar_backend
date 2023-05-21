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
        await User.findByIdAndUpdate(id, { $push: { meetings: meeting._id } });
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
        return res
          .status(404)
          .send({ message: "No meeting found for this timestamp" });
      }
      res.send(meeting);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async getById(req, res) {
    try {
      const meeting = await Meeting.findById(req.params._id);
      if (!meeting) {
        return res.status(404).send({ message: "No meeting found" });
      }
      res.send(meeting);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async delete(req, res) {
    try {
      const meeting = await Meeting.findById(req.params._id);

      meeting.assistants.forEach(async (id) => {
        await User.findByIdAndUpdate(id, { $pull: { meetings: meeting._id }});
      });

      await Meeting.findByIdAndDelete(meeting._id);
      res.send({ message: `You cancelled your meeting on ${meeting.date}` });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
};

module.exports = MeetingController;
