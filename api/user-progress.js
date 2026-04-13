import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const scores = await sql`
      SELECT module_id, best_score, quiz_attempts, passed, last_attempt
      FROM scores
      WHERE user_id = ${userId}
    `;

    const totalScore = scores.reduce((sum, r) => sum + r.best_score, 0);
    const modulesCompleted = scores.filter((r) => r.passed).length;

    res.status(200).json({
      totalScore,
      modulesCompleted,
      modules: scores,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}