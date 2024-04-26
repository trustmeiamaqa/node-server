import { Client } from 'pg';
import _ from 'lodash';

const dbClient = (dbName: string) => {
  const dbHost = process.env.dbHost;
  const dbPort = process.env.dbPort;
  const dbUser = process.env.dbUser;
  const dbPass = process.env.dbPass;

  return new Client({
    host: dbHost,
    port: _.toNumber(dbPort),
    user: dbUser,
    password: dbPass,
    database: dbName,
    // ssl: { rejectUnauthorized: false },
  });
};

const connect = async (client) => {
  try {
    await client.connect(); // Connect to the PostgreSQL database
    // console.log('PostgreSQL database connected');
  } catch (error) {
    console.error('Connection error:', error.stack);
    throw error; // Rethrow the error to be caught by the caller
  }
};

// Function to query a new record from the database
export const queryNewRecord = async (id: string) => {
  const dbNameUserApp = process.env.dbName;
  const client = dbClient(dbNameUserApp);

  try {
    await connect(client); // Connect to the database
    const query = `
      SELECT title, description, published 
      FROM tutorials 
      WHERE id = '${id}';
    `;
    const result = await client.query(query);
    return result.rows[0];
  } catch (error) {
    console.error('Query error:', error.stack);
    throw error;
  } finally {
    await client.end();
  }
};
