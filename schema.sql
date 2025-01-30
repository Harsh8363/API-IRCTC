CREATE DATABASE irctc;
USE irctc;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(300) NOT NULL,
  email VARCHAR(300) UNIQUE NOT NULL,
  password VARCHAR(300) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE trains (
  id INT AUTO_INCREMENT PRIMARY KEY,
  train_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(300) NOT NULL,
  source VARCHAR(300) NOT NULL,
  destination VARCHAR(300) NOT NULL,
  total_seats INT NOT NULL,
  available_seats INT NOT NULL,
  departure_time DATETIME NOT NULL,
  arrival_time DATETIME NOT NULL,
  INDEX (source),
  INDEX (destination)
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  train_id INT NOT NULL,
  user_id INT NOT NULL,
  seat_count INT NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
