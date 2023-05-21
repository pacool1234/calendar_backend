const express = require("express");
const BookingController = require("../controllers/BookingController");
const { authentication } = require("../middlewares/authentication");
const router = express.Router();

router.post("/create", authentication, BookingController.create);
router.get("/getall", BookingController.getAll);
router.get("/getbydate", BookingController.getByDate);
router.get("/getbyid/:_id", BookingController.getById);
router.delete("/delete/:_id", authentication, BookingController.delete);

module.exports = router;
