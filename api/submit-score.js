import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sql = neon(process.env.DATABASE_URL);
  const { userId, moduleId, score, passed } = req.body;

  if (!userId || !moduleId || score === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const existing = await sql`
      SELECT * FROM scores
      WHERE user_id = ${userId} AND module_id = ${moduleId}
    `;

    if (existing.length > 0) {
      const current = existing[0];
      const newBestScore = Math.max(current.best_score, score);
      const newPassed = current.passed || passed;
      const newAttempts = current.quiz_attempts + 1;

      await sql`
        UPDATE scores
        SET best_score = ${newBestScore},
            passed = ${newPassed},
            quiz_attempts = ${newAttempts},
            last_attempt = NOW()
        WHERE user_id = ${userId} AND module_id = ${moduleId}
      `;

      res.status(200).json({
        bestScore: newBestScore,
        passed: newPassed,
        attempts: newAttempts,
        improved: score > current.best_score,
      });
    } else {
      await sql`
        INSERT INTO scores (user_id, module_id, best_score, quiz_attempts, passed, last_attempt)
        VALUES (${userId}, ${moduleId}, ${score}, 1, ${passed}, NOW())
      `;

      res.status(201).json({
        bestScore: score,
        passed,
        attempts: 1,
        improved: true,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}