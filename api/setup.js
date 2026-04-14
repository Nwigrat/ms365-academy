import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  try {
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
      DO $$ BEGIN
        ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';
      EXCEPTION WHEN others THEN NULL;
      END $$
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS modules (
        id VARCHAR(50) PRIMARY KEY,
        icon VARCHAR(10) NOT NULL DEFAULT '📘',
        title VARCHAR(100) NOT NULL,
        description TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS resources (
        id SERIAL PRIMARY KEY,
        module_id VARCHAR(50) REFERENCES modules(id) ON DELETE CASCADE,
        icon VARCHAR(10) DEFAULT '📖',
        title VARCHAR(200) NOT NULL,
        description VARCHAR(200),
        url TEXT,
        sort_order INTEGER DEFAULT 0
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        module_id VARCHAR(50) REFERENCES modules(id) ON DELETE CASCADE,
        question_text TEXT NOT NULL,
        option_a VARCHAR(300) NOT NULL,
        option_b VARCHAR(300) NOT NULL,
        option_c VARCHAR(300) NOT NULL,
        option_d VARCHAR(300) NOT NULL,
        correct_answer INTEGER NOT NULL,
        sort_order INTEGER DEFAULT 0
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

    await sql`
      CREATE TABLE IF NOT EXISTS user_badges (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        badge_id VARCHAR(50) NOT NULL,
        unlocked_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, badge_id)
      )
    `;

    res.status(200).json({ message: "All tables created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}