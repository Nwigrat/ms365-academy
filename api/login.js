import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sql = neon(process.env.DATABASE_URL);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const result = await sql`
      SELECT id, first_name, last_name, username, password, role
      FROM users
      WHERE username = ${username.trim().toLowerCase()}
    `;

    if (result.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.status(200).json({
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
    res.status(500).json({ error: error.message });
  }
}