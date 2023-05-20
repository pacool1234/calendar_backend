const express = require("express");
const BookingController = require("../controllers/BookingController");
const { authentication } = require("../middlewares/authentication");
const router = express.Router();

router.post("/create", authentication, BookingController.create);
router.get("/getall", BookingController.getall);
router.get("/getbooking", BookingController.getbooking);
router.put("/update/:_id", BookingController.update);
router.delete("/delete/:_id", BookingController.delete);

module.exports = router;
