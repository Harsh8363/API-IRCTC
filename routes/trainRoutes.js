const express = require("express");
const router = express.Router();
const trainController = require("../controllers/trainController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create", authMiddleware.verifyToken, trainController.createTrain);
router.get("/availability", trainController.getTrainAvailability);

module.exports = router;
