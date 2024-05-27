const { Client } = require('pg');

// Create a new instance of the PostgreSQL client
const client = new Client({
  connectionString: 'postgresql://username:password@localhost:5432/database_name' // Adjust as needed
});

// Connect to the PostgreSQL database
const connect = async () => {
  try {
    await client.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

// Method to drop and create the tables for your application and seed data
const init = async () => {
  try {
    const SQL = `
      DROP TABLE IF EXISTS employees;
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50),
        is_admin BOOLEAN
      );
      INSERT INTO employees (name, is_admin) VALUES
      ('John Doe', true),
      ('Jane Smith', false);
    `;

    await client.query(SQL);
    console.log('Data seeded');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Fetch methods and other database-related functions here
const fetchCustomers = async () => {
  const result = await client.query('SELECT * FROM customers');
  return result.rows;
};

const fetchRestaurants = async () => {
  const result = await client.query('SELECT * FROM restaurants');
  return result.rows;
};

const fetchReservations = async () => {
  const result = await client.query('SELECT * FROM reservations');
  return result.rows;
};

const createReservation = async (customerId, restaurantId, date, partyCount) => {
  const result = await client.query(
    'INSERT INTO reservations (customer_id, restaurant_id, date, party_count) VALUES ($1, $2, $3, $4) RETURNING *',
    [customerId, restaurantId, date, partyCount]
  );
  return result.rows[0];
};

const destroyReservation = async (customerId, reservationId) => {
  await client.query('DELETE FROM reservations WHERE id = $1 AND customer_id = $2', [reservationId, customerId]);
};

module.exports = {
  client,
  connect,
  init,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  createReservation,
  destroyReservation
};
