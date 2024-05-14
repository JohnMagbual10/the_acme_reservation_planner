const express = require('express');
const app = express();
const {
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  createReservation,
  destroyReservation
} = require('./db');

//middleware setup
app.use(express.json());

app.get('/api/customers', async (req, res, next) => {
  try {
    const customers = await fetchCustomers();
    res.send(customers);
  } catch (error) {
    next(error);
  }
});
