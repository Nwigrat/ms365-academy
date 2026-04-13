import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  try {
    const result = await sql`
      SELECT
        u.id,
        u.username,
        COALESCE(SUM(s.best_score), 0) AS total_score,
        COUNT(CASE WHEN s.passed = true THEN 1 END) AS modules_completed,
        COALESCE(SUM(s.quiz_attempts), 0) AS total_attempts
      FROM users u
      LEFT JOIN scores s ON u.id = s.user_id
      GROUP BY u.id, u.username
      ORDER BY total_score DESC
      LIMIT 50
    `;

    res.status(200).json({ leaderboard: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}