// Handled RACE CONDITIONS while booking... //

/*
By using transactions and row-level locking, I ensure that only one user can book the available seats at a given time.
If multiple users try to book seats simultaneously, only one user's booking will be successful, and the others will receive an error indicating that there are not enough seats available.
*/

const db = require("../config/database");
const Train = require("../models/train");
const Booking = require("../models/booking");

exports.bookSeat = async (req, res, next) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const { trainId, seatCount } = req.body;
    const userId = req.user.userId;

    // Check if train exists and lock it for update
    const [trainRows] = await connection.query(
      "SELECT * FROM trains WHERE id = ? FOR UPDATE",
      [trainId]
    );
    const train = trainRows[0];

    if (!train) {
      await connection.rollback();
      return res.status(404).json({ error: "Train not found" });
    }

    // Check seat availability
    if (train.available_seats < seatCount) {
      await connection.rollback();
      return res.status(400).json({ error: "Not enough seats available" });
    }

    // Create the booking using the same connection
    const newBooking = new Booking({ trainId, userId, seatCount });
    const bookingId = await Booking.create(newBooking, connection);

    // Update available seats
    const newAvailableSeats = train.available_seats - seatCount;
    await connection.query(
      "UPDATE trains SET available_seats = ? WHERE id = ?",
      [newAvailableSeats, trainId]
    );

    await connection.commit();
    res.status(201).json({ bookingId });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
};


exports.cancelSeat = async (req, res, next) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const { trainId,bookingId, seatCount } = req.body;
    const userId = req.user.userId;

    // Check if train exists and lock it for update
    const [trainRows] = await connection.query(
      "SELECT * FROM trains WHERE id = ? FOR UPDATE",
      [trainId]
    );
    const [bookingRows] = await connection.query(
      "SELECT * FROM bookings WHERE id = ? FOR UPDATE",
      [bookingId]
    );
    const train = trainRows[0];
    const booking = bookingRows[0];

    // Update available seats
    const newAvailableSeats = train.available_seats + seatCount;
    await connection.query(
      "UPDATE trains SET available_seats = ? WHERE id = ?",
      [newAvailableSeats, trainId]
    );
    
    await connection.query(
      "DELETE FROM bookings  WHERE id = ?",
      [bookingId]
    );

    await connection.commit();
    res.status(201).json("Booking Cancelled");
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
};



exports.getBookingDetails = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { trainId } = req.query;

    // Find booking by user ID and train ID
    const booking = await Booking.findByUserIdAndTrainId(userId, trainId,db);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};

 