import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  // Admin only
  const adminUserId = req.headers['x-admin-user-id'];
  if (!adminUserId) return res.status(401).json({ error: 'Auth required' });

  const adminCheck = await sql`SELECT role FROM users WHERE id = ${adminUserId}`;
  if (adminCheck.length === 0 || adminCheck[0].role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  try {
    // 1. Overview stats
    const overview = await sql`
      SELECT
        (SELECT COUNT(*)::int FROM users) AS total_users,
        (SELECT COUNT(*)::int FROM users WHERE role = 'admin') AS total_admins,
        (SELECT COUNT(*)::int FROM modules WHERE is_active = true) AS total_modules,
        (SELECT COALESCE(SUM(quiz_attempts), 0)::int FROM scores) AS total_quizzes_taken,
        (SELECT COUNT(*)::int FROM scores WHERE passed = true) AS total_quizzes_passed,
        (SELECT COUNT(DISTINCT user_id)::int FROM scores) AS active_learners
    `;

    // 2. Pass rate
    const passRateData = await sql`
      SELECT
        CASE WHEN SUM(quiz_attempts) > 0
          THEN ROUND((COUNT(CASE WHEN passed THEN 1 END)::numeric / NULLIF(SUM(quiz_attempts), 0)) * 100, 1)
          ELSE 0
        END AS overall_pass_rate
      FROM scores
    `;

    // 3. Module performance — pass rate & avg score per module
    const moduleStats = await sql`
      SELECT
        m.id,
        m.icon,
        m.title,
        COUNT(DISTINCT s.user_id)::int AS users_attempted,
        COALESCE(SUM(s.quiz_attempts), 0)::int AS total_attempts,
        COUNT(CASE WHEN s.passed = true THEN 1 END)::int AS users_passed,
        COALESCE(ROUND(AVG(s.best_score), 1), 0) AS avg_score,
        CASE WHEN COUNT(DISTINCT s.user_id) > 0
          THEN ROUND((COUNT(CASE WHEN s.passed THEN 1 END)::numeric / COUNT(DISTINCT s.user_id)) * 100, 1)
          ELSE 0
        END AS pass_rate
      FROM modules m
      LEFT JOIN scores s ON m.id = s.module_id
      WHERE m.is_active = true
      GROUP BY m.id, m.icon, m.title, m.sort_order
      ORDER BY m.sort_order
    `;

    // 4. Top performers
    const topPerformers = await sql`
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.username,
        COALESCE(SUM(s.best_score), 0)::int AS total_score,
        COUNT(CASE WHEN s.passed THEN 1 END)::int AS modules_completed,
        COALESCE(SUM(s.quiz_attempts), 0)::int AS total_attempts,
        (SELECT COUNT(*)::int FROM user_badges ub WHERE ub.user_id = u.id) AS badges_earned
      FROM users u
      LEFT JOIN scores s ON u.id = s.user_id
      GROUP BY u.id, u.first_name, u.last_name, u.username
      ORDER BY total_score DESC
      LIMIT 10
    `;

    // 5. Recent activity (last 20 quiz submissions)
    const recentActivity = await sql`
      SELECT
        u.first_name,
        u.last_name,
        u.username,
        s.module_id,
        m.icon AS module_icon,
        m.title AS module_title,
        s.best_score,
        s.passed,
        s.quiz_attempts,
        s.last_attempt
      FROM scores s
      JOIN users u ON s.user_id = u.id
      JOIN modules m ON s.module_id = m.id
      WHERE s.last_attempt IS NOT NULL
      ORDER BY s.last_attempt DESC
      LIMIT 20
    `;

    // 6. User registration trend (last 30 days)
    const registrationTrend = await sql`
      SELECT
        DATE(created_at) AS date,
        COUNT(*)::int AS new_users
      FROM users
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `;

    // 7. Hardest questions (lowest correct rate)
    const hardestQuestions = await sql`
      SELECT
        q.id,
        q.question_text,
        q.module_id,
        m.icon AS module_icon,
        m.title AS module_title,
        q.correct_answer
      FROM questions q
      JOIN modules m ON q.module_id = m.id
      ORDER BY q.id
      LIMIT 50
    `;

    // 8. Badge distribution
    const badgeStats = await sql`
      SELECT
        badge_id,
        COUNT(*)::int AS times_earned
      FROM user_badges
      GROUP BY badge_id
      ORDER BY times_earned DESC
    `;

    res.status(200).json({
      overview: overview[0],
      passRate: passRateData[0]?.overall_pass_rate || 0,
      moduleStats,
      topPerformers,
      recentActivity,
      registrationTrend,
      badgeStats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}