const { Client } = require("pg");

const createTables = `
    CREATE TABLE IF NOT EXISTS users(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(100) UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        hash TEXT NOT NULL,
        isAdmin BOOLEAN DEFAULT false,
        isMember BOOLEAN DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS posts(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        author_id UUID REFERENCES users(id),
        title VARCHAR(100) NOT NULL,
        body TEXT,
        created_at TIMESTAMP DEFAULT NOW()
    );
`;

async function main() {
  console.log("creating DB tables");
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING,
  });
  await client.connect();
  await client.query(createTables);
  await client.end();
  console.log("done");
}

main();
