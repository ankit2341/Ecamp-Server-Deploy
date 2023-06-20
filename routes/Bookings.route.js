const express = require("express");
const { auth } = require("../middleware/auth");

const { BookingsModel } = require("../model/Bookings.model");
const bookingRouter = express.Router();

bookingRouter.get("/", async (req, res) => {
  const { page } = req.query;
  try {
    if (page != undefined) {
      if (page == 1) {
        const camps = await BookingsModel.find().skip(0).limit(8);
        res.status(200).send(camps);
      } else {
        const camps = await BookingsModel.find()
          .skip((page - 1) * 8)
          .limit(8);
        res.status(200).send(camps);
      }
    } else {
      res.status(200).send({ msg: "page mising" });
    }
  } catch (err) {
    res.status(404).send({ msg: "error connecting to api" });
  }
});

bookingRouter.get("/:user_id", async (req, res) => {
  const id = req.params.user_id;
  try {
    const bookings = await BookingsModel.find({ user_id: id });
    res.status(200).send(bookings);
  } catch (err) {
    res.status(404).send({ msg: "404 error" });
  }
});

bookingRouter.use(auth);

bookingRouter.post("/", async (req, res) => {
  const body = req.body;
  try {
    const bookings = new BookingsModel(body);
    await bookings.save();
    res.status(200).send({ msg: "booking successfull" });
  } catch (err) {
    res.status(404).send({ msg: "404 error" });
  }
});

module.exports = {
  bookingRouter,
};
