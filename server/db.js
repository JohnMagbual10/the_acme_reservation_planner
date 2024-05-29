const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

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
      DROP TABLE IF EXISTS reservations;
      DROP TABLE IF EXISTS customers;
      DROP TABLE IF EXISTS restaurants;

      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS restaurants (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reservations (
        id UUID PRIMARY KEY,
        date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
        customer_id UUID REFERENCES customers(id) NOT NULL
      );

      INSERT INTO customers (id, name) VALUES
      ('${uuidv4()}', 'John Magbual'),
      ('${uuidv4()}', 'Xiaojia Qin');
      
      INSERT INTO restaurants (id, name) VALUES
      ('${uuidv4()}', 'The Great Restaurant'),
      ('${uuidv4()}', 'Good Eats');
    `;

    await client.query(SQL);
    console.log('Tables created and data seeded successfully');
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
    'INSERT INTO reservations (id, customer_id, restaurant_id, date, party_count) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [uuidv4(), customerId, restaurantId, date, partyCount]
  );
  return result.rows[0];
};

const destroyReservation = async (reservationId) => {
  await client.query('DELETE FROM reservations WHERE id = $1', [reservationId]);
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
