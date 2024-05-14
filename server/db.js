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