import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sql = neon(process.env.DATABASE_URL);
  const { username } = req.body;

  if (!username || username.trim().length === 0) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const existing = await sql`
      SELECT * FROM users WHERE username = ${username.trim()}
    `;

    if (existing.length > 0) {
      return res.status(200).json({ user: existing[0], isNew: false });
    }

    const result = await sql`
      INSERT INTO users (username)
      VALUES (${username.trim()})
      RETURNING *
    `;

    res.status(201).json({ user: result[0], isNew: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}