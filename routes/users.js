const express = require("express");
const UserController = require("../controllers/UserController");
const { authentication } = require("../middlewares/authentication");
const { uploadUserImg } = require("../middlewares/upload");
const router = express.Router();

router.get("/getall", UserController.getAll);
router.get("/getbyid/:_id", UserController.getById);
router.get("/getbyname/:name", UserController.getByName);
router.get("/confirm/:emailToken", UserController.confirm);
router.get("/recoverPassword/:email", UserController.recoverPassword);
router.get("/resetPassword/:recoverToken", UserController.resetPassword);
router.post("/create", uploadUserImg.single("image"), UserController.create);
router.post("/login", UserController.login);
router.put("/logout", authentication, UserController.logout);
router.put("/update", uploadUserImg.single("image"), authentication, UserController.update);
router.delete("/delete", authentication, UserController.delete);

module.exports = router;
