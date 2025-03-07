const db = require("../config/database");


// module.exports = Booking;
const Booking = function (booking) {
  this.trainId = booking.trainId;
  this.userId = booking.userId;
  this.seatCount = booking.seatCount;
};

Booking.create = async (newBooking, connection) => {
  const query =
    "INSERT INTO bookings (train_id, user_id, seat_count) VALUES (?, ?, ?)";
  const values = [newBooking.trainId, newBooking.userId, newBooking.seatCount];

  try {
    const [result] = await connection.query(query, values);
    return result.insertId;
  } catch (err) {
    throw err;
  }
};

Booking.findByUserIdAndTrainId = async (userId, trainId, connection) => {
  const query = "SELECT * FROM bookings WHERE user_id = ? AND train_id = ?";

  try {
    const [rows] = await connection.query(query, [userId, trainId]);
    return rows[0];
  } catch (err) {
    throw err;
  }
};

module.exports = Booking;
