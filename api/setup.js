import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(40) UNIQUE NOT NULL,
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