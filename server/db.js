const { Client } = require('pg');

// Create a new instance of the PostgreSQL client
const client = new Client({
  // Add your PostgreSQL connection configuration here
  // For example:
  // connectionString: 'postgresql://username:password@localhost:5432/database_name'
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

// Method to drop and create the tables for your application
const createTables = async () => {
  try {
    // Define your SQL statements to drop and create tables
    const dropTablesQuery = `
      DROP TABLE IF EXISTS customers;
      DROP TABLE IF EXISTS restaurants;
      DROP TABLE IF EXISTS reservations;
    `;
    const createTablesQuery = `
      CREATE TABLE customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
      CREATE TABLE restaurants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
      CREATE TABLE reservations (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        restaurant_id INTEGER REFERENCES restaurants(id),
        reservation_date DATE NOT NULL
      );
    `;
   // Execute the SQL statements
   await client.query(dropTablesQuery);
   await client.query(createTablesQuery);

   console.log('Tables created successfully');
 } catch (error) {
   console.error('Error creating tables:', error);
 }
};

// Method to create a restaurant in the database and return the created record
const createRestaurant = async (name) => {
    try {
      const query = 'INSERT INTO restaurants (name) VALUES ($1) RETURNING *';
      const values = [name];
  
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating restaurant:', error);
    }
  };
  
  // Method to fetch all customers from the database
  const fetchCustomers = async () => {
    try {
      const query = 'SELECT * FROM customers';
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };
  
  // Method to fetch all restaurants from the database
  const fetchRestaurants = async () => {
    try {
      const query = 'SELECT * FROM restaurants';
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };
  
  // Method to create a reservation in the database and return the created record
  const createReservation = async (customerId, restaurantId, reservationDate) => {
    try {
      const query = 'INSERT INTO reservations (customer_id, restaurant_id, reservation_date) VALUES ($1, $2, $3) RETURNING *';
      const values = [customerId, restaurantId, reservationDate];
  
      const result = await client.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };
  
  // Method to delete a reservation from the database
  const destroyReservation = async (reservationId) => {
    try {
      const query = 'DELETE FROM reservations WHERE id = $1';
      const values = [reservationId];
  
      await client.query(query, values);
      console.log('Reservation deleted successfully');
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };