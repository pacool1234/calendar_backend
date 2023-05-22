const mongoose = require("mongoose");
const transporter = require("../config/nodemailer");
const Booking = require("../models/Booking");
const User = require("../models/User");

const BookingController = {
  async create(req, res) {
    try {
      const bookingExists = await Booking.findOne({ date: req.body.date });
      if (bookingExists) {
        const arrayOfUsers = bookingExists.users; // Retrieve users that booked tha timestamp
        if (arrayOfUsers.includes(req.user._id)) {
          return res.send({
            message: "You already booked this timestamp",
            bookingExists,
          });
        }
        await Booking.findByIdAndUpdate(
          bookingExists._id,
          { $push: { users: req.user._id } },
          { new: true }
        );
        await User.findByIdAndUpdate(req.user._id, {
          $push: { bookings: bookingExists._id },
        });

        // After a user joins a timestamp, then, process which users already present match with the said user
        const userLeaving = await User.findById(req.user._id); // bring creator's matches
        arrayOfUsers.forEach(async (id) => {
          if (userLeaving.matches.includes(id)) {
            const documentFromMatch = await User.findOne({
              _id: id,
              "bookingMatchingUsers.date": bookingExists.date,
            });
            if (documentFromMatch) {
              await User.updateOne(
                { _id: id, "bookingMatchingUsers.date": bookingExists.date },
                { $addToSet: { "bookingMatchingUsers.$.users": req.user._id } }
              );
            } else {
              // That match has NO booking for that timestamp, create one
              await User.updateOne(
                { _id: id },
                {
                  $push: {
                    bookingMatchingUsers: {
                      date: bookingExists.date,
                      users: [req.user._id],
                    },
                  },
                }
              );
            }

            const documentFromCreator = await User.findOne({
              _id: req.user._id,
              "bookingMatchingUsers.date": bookingExists.date,
            });
            if (documentFromCreator) {
              await User.updateOne(
                {
                  _id: req.user._id,
                  "bookingMatchingUsers.date": bookingExists.date,
                },
                { $addToSet: { "bookingMatchingUsers.$.users": id } }
              );
            } else {
              // User has NO booking for that timestamp, create one
              await User.updateOne(
                { _id: req.user._id },
                {
                  $push: {
                    bookingMatchingUsers: {
                      date: bookingExists.date,
                      users: [id],
                    },
                  },
                }
              );
            }
          }
        });
        return res.send({
          message:
            "You just joined this previously created timestamp. All good",
        });
      }
      // Below: case when user is 1st one to book that timestamp
      req.body.users = [req.user._id]; // Must add ID of user who books a given time for the 1st time
      const newBooking = await Booking.create(req.body);
      await User.findByIdAndUpdate(req.user._id, {
        $push: { bookings: newBooking._id },
      });
      res.status(201).send({ message: "Booking created", newBooking });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async getAll(req, res) {
    try {
      const bookings = await Booking.find();
      res.send(bookings);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async getByDate(req, res) {
    try {
      const booking = await Booking.findOne({ date: req.body.date });
      if (!booking) {
        return res
          .status(404)
          .send({ message: "No booking found for this timestamp" });
      }
      res.send(booking);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async getById(req, res) {
    try {
      const booking = await Booking.findById(req.params._id);
      if (!booking) {
        return res.status(404).send({ message: "No booking found" });
      }
      res.send(booking);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },

  async delete(req, res) {
    try {
      const booking = await Booking.findById(req.params._id);

      if (!booking) {
        return res.status(404).send({ message: "Booking not found" });
      }

      await User.findByIdAndUpdate(req.user._id, {
        $pull: { bookings: booking._id },
      });

      const arrayOfUsers = booking.users;
      if (arrayOfUsers.length === 1 && arrayOfUsers.includes(req.user._id)) {
        await Booking.findByIdAndDelete(booking._id);
      } else {
        const filteredArrayOfUsers = arrayOfUsers.filter(
          (id) => !id.equals(req.user._id) // use the equals method provided by mongoose ObjectId
        ); 
        await Booking.findByIdAndUpdate(
          booking._id,
          { users: filteredArrayOfUsers },
          { new: true }
        );
      }
      

      // After a user abandons a timestamp, then, pull them out from bookingMatchingUsers array from remaining users
      const userLeaving = await User.findById(req.user._id); // bring leaver's matches
      arrayOfUsers.forEach(async (id) => {
        if (userLeaving.matches.includes(id)) {
          const documentFromMatch = await User.findOne({
            _id: id,
            "bookingMatchingUsers.date": booking.date,
          });
          if (documentFromMatch) {
            await User.updateOne(
              { _id: id, "bookingMatchingUsers.date": booking.date },
              { $pull: { "bookingMatchingUsers.$.users": req.user._id } }
            );
          } 

          const documentFromCreator = await User.findOne({
            _id: req.user._id,
            "bookingMatchingUsers.date": booking.date,
          });
          if (documentFromCreator) {
            await User.updateOne(
              {
                _id: req.user._id,
                "bookingMatchingUsers.date": booking.date,
              },
              { $pull: { "bookingMatchingUsers.$.users": id } }
            );
          }
        }
      });
      res.send({ message: `You cancelled your booking on ${booking.date}` });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
};

module.exports = BookingController;
