import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);
  const { action } = req.query;

  // GET actions
  if (req.method === 'GET') {
    if (action === 'leaderboard') {
      try {
        const result = await sql`
          SELECT
            u.id, u.username, u.first_name, u.last_name,
            CONCAT(u.first_name, ' ', u.last_name) AS display_name,
            COALESCE(SUM(s.best_score), 0)::int AS total_score,
            COUNT(CASE WHEN s.passed = true THEN 1 END)::int AS modules_completed,
            COALESCE(SUM(s.quiz_attempts), 0)::int AS total_attempts
          FROM users u
          LEFT JOIN scores s ON u.id = s.user_id
          GROUP BY u.id, u.username, u.first_name, u.last_name
          ORDER BY total_score DESC
          LIMIT 50
        `;
        return res.status(200).json({ leaderboard: result });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    if (action === 'user-progress') {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ error: 'userId is required' });

      try {
        const scores = await sql`
          SELECT module_id, best_score, quiz_attempts, passed, last_attempt
          FROM scores WHERE user_id = ${userId}
        `;
        const totalScore = scores.reduce((sum, r) => sum + r.best_score, 0);
        const modulesCompleted = scores.filter((r) => r.passed).length;

        return res.status(200).json({ totalScore, modulesCompleted, modules: scores });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    return res.status(400).json({ error: 'Invalid action' });
  }

  // POST: submit score
  if (req.method === 'POST' && action === 'submit') {
    const { userId, moduleId, score, passed } = req.body;

    if (!userId || !moduleId || score === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const existing = await sql`
        SELECT * FROM scores WHERE user_id = ${userId} AND module_id = ${moduleId}
      `;

      if (existing.length > 0) {
        const current = existing[0];
        const newBestScore = Math.max(current.best_score, score);
        const newPassed = current.passed || passed;
        const newAttempts = current.quiz_attempts + 1;

        await sql`
          UPDATE scores
          SET best_score = ${newBestScore}, passed = ${newPassed},
              quiz_attempts = ${newAttempts}, last_attempt = NOW()
          WHERE user_id = ${userId} AND module_id = ${moduleId}
        `;

        return res.status(200).json({
          bestScore: newBestScore, passed: newPassed, attempts: newAttempts,
          improved: score > current.best_score,
        });
      } else {
        await sql`
          INSERT INTO scores (user_id, module_id, best_score, quiz_attempts, passed, last_attempt)
          VALUES (${userId}, ${moduleId}, ${score}, 1, ${passed}, NOW())
        `;
        return res.status(201).json({ bestScore: score, passed, attempts: 1, improved: true });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}