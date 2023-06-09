const express = require("express");
const MeetingController = require("../controllers/MeetingController");
const { authentication } = require("../middlewares/authentication");
const router = express.Router();

router.post("/create", authentication, MeetingController.create);
router.get("/getall", MeetingController.getAll);
router.get("/getbydate", MeetingController.getByDate);
router.get("/getbyid/:_id", MeetingController.getById);
router.delete("/delete/:_id", authentication, MeetingController.delete);

module.exports = router;
