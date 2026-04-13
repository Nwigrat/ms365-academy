import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  try {
    // ⚠️ Uncomment these two lines ONCE to recreate tables, then re-comment them
    await sql`DROP TABLE IF EXISTS scores`;
    await sql`DROP TABLE IF EXISTS users`;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(40) NOT NULL,
        last_name VARCHAR(40) NOT NULL,
        username VARCHAR(40) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS scores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        module_id VARCHAR(50) NOT NULL,
        best_score INTEGER DEFAULT 0,
        quiz_attempts INTEGER DEFAULT 0,
        passed BOOLEAN DEFAULT FALSE,
        last_attempt TIMESTAMP,
        UNIQUE(user_id, module_id)
      )
    `;

    res.status(200).json({ message: "Tables created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}