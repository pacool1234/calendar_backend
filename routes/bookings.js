const express = require("express");
const BookingController = require("../controllers/BookingController");
const { authentication } = require("../middlewares/authentication");
const router = express.Router();

router.post("/create", BookingController.create);
router.get("/getall", BookingController.getall);
router.get("/getbooking/:_id", BookingController.getbooking);
router.put("/update/:_id", BookingController.update);
router.delete("/delete/:_id", BookingController.delete);

module.exports = router;
