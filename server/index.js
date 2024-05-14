const express = require('express');
const app = express();
const {
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  createReservation,
  destroyReservation
} = require('./db');

app.use(express.json());