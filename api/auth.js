import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sql = neon(process.env.DATABASE_URL);
  const { action } = req.query;

  if (action === 'login') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
      const result = await sql`
        SELECT id, first_name, last_name, username, password, role
        FROM users WHERE username = ${username.trim().toLowerCase()}
      `;

      if (result.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      return res.status(200).json({
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          displayName: `${user.first_name} ${user.last_name}`,
          role: user.role || 'user',
        },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (action === 'register') {
    const { firstName, lastName, username, password } = req.body;

    if (!firstName || !firstName.trim()) return res.status(400).json({ error: 'First name is required' });
    if (!lastName || !lastName.trim()) return res.status(400).json({ error: 'Last name is required' });
    if (!username || !username.trim()) return res.status(400).json({ error: 'Username is required' });
    if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    try {
      const existing = await sql`
        SELECT id FROM users WHERE username = ${username.trim().toLowerCase()}
      `;

      if (existing.length > 0) {
        return res.status(409).json({ error: 'Username already taken' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userCount = await sql`SELECT COUNT(*)::int AS count FROM users`;
      const isFirstUser = userCount[0].count === 0;

      const result = await sql`
        INSERT INTO users (first_name, last_name, username, password, role)
        VALUES (
          ${firstName.trim()}, ${lastName.trim()},
          ${username.trim().toLowerCase()}, ${hashedPassword},
          ${isFirstUser ? 'admin' : 'user'}
        )
        RETURNING id, first_name, last_name, username, role, created_at
      `;

      const user = result[0];

      return res.status(201).json({
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          displayName: `${user.first_name} ${user.last_name}`,
          role: user.role,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(400).json({ error: 'Invalid action. Use ?action=login or ?action=register' });
}