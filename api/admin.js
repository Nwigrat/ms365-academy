import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  const adminUserId = req.headers['x-admin-user-id'];
  if (!adminUserId) return res.status(401).json({ error: 'Authentication required' });

  const adminCheck = await sql`SELECT role FROM users WHERE id = ${adminUserId}`;
  if (adminCheck.length === 0 || adminCheck[0].role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { action } = req.query;

  // ===== GET ACTIONS =====
  if (req.method === 'GET') {
    try {
      switch (action) {
        case 'list-users': {
          const users = await sql`
            SELECT u.id, u.first_name, u.last_name, u.username, u.role, u.created_at,
              COALESCE(SUM(s.best_score), 0)::int AS total_score,
              COUNT(CASE WHEN s.passed = true THEN 1 END)::int AS modules_completed,
              COALESCE(SUM(s.quiz_attempts), 0)::int AS total_attempts
            FROM users u LEFT JOIN scores s ON u.id = s.user_id
            GROUP BY u.id, u.first_name, u.last_name, u.username, u.role, u.created_at
            ORDER BY u.created_at DESC
          `;
          return res.status(200).json({ users });
        }

        case 'stats': {
          const totalUsers = await sql`SELECT COUNT(*)::int AS count FROM users`;
          const totalAdmins = await sql`SELECT COUNT(*)::int AS count FROM users WHERE role = 'admin'`;
          const totalQuizzes = await sql`SELECT COALESCE(SUM(quiz_attempts), 0)::int AS count FROM scores`;
          const totalPassed = await sql`SELECT COUNT(*)::int AS count FROM scores WHERE passed = true`;

          return res.status(200).json({
            totalUsers: totalUsers[0].count,
            totalAdmins: totalAdmins[0].count,
            totalQuizzesTaken: totalQuizzes[0].count,
            totalQuizzesPassed: totalPassed[0].count,
          });
        }

        case 'analytics': {
          const overview = await sql`
            SELECT
              (SELECT COUNT(*)::int FROM users) AS total_users,
              (SELECT COUNT(*)::int FROM users WHERE role = 'admin') AS total_admins,
              (SELECT COUNT(*)::int FROM modules WHERE is_active = true) AS total_modules,
              (SELECT COALESCE(SUM(quiz_attempts), 0)::int FROM scores) AS total_quizzes_taken,
              (SELECT COUNT(*)::int FROM scores WHERE passed = true) AS total_quizzes_passed,
              (SELECT COUNT(DISTINCT user_id)::int FROM scores) AS active_learners
          `;

          const passRateData = await sql`
            SELECT CASE WHEN SUM(quiz_attempts) > 0
              THEN ROUND((COUNT(CASE WHEN passed THEN 1 END)::numeric / NULLIF(SUM(quiz_attempts), 0)) * 100, 1)
              ELSE 0 END AS overall_pass_rate
            FROM scores
          `;

          const moduleStats = await sql`
            SELECT m.id, m.icon, m.title,
              COUNT(DISTINCT s.user_id)::int AS users_attempted,
              COALESCE(SUM(s.quiz_attempts), 0)::int AS total_attempts,
              COUNT(CASE WHEN s.passed = true THEN 1 END)::int AS users_passed,
              COALESCE(ROUND(AVG(s.best_score), 1), 0) AS avg_score,
              CASE WHEN COUNT(DISTINCT s.user_id) > 0
                THEN ROUND((COUNT(CASE WHEN s.passed THEN 1 END)::numeric / COUNT(DISTINCT s.user_id)) * 100, 1)
                ELSE 0 END AS pass_rate
            FROM modules m LEFT JOIN scores s ON m.id = s.module_id
            WHERE m.is_active = true
            GROUP BY m.id, m.icon, m.title, m.sort_order ORDER BY m.sort_order
          `;

          const topPerformers = await sql`
            SELECT u.id, u.first_name, u.last_name, u.username,
              COALESCE(SUM(s.best_score), 0)::int AS total_score,
              COUNT(CASE WHEN s.passed THEN 1 END)::int AS modules_completed,
              COALESCE(SUM(s.quiz_attempts), 0)::int AS total_attempts,
              (SELECT COUNT(*)::int FROM user_badges ub WHERE ub.user_id = u.id) AS badges_earned
            FROM users u LEFT JOIN scores s ON u.id = s.user_id
            GROUP BY u.id, u.first_name, u.last_name, u.username
            ORDER BY total_score DESC LIMIT 10
          `;

          const recentActivity = await sql`
            SELECT u.first_name, u.last_name, u.username,
              s.module_id, m.icon AS module_icon, m.title AS module_title,
              s.best_score, s.passed, s.quiz_attempts, s.last_attempt
            FROM scores s JOIN users u ON s.user_id = u.id JOIN modules m ON s.module_id = m.id
            WHERE s.last_attempt IS NOT NULL ORDER BY s.last_attempt DESC LIMIT 20
          `;

          const registrationTrend = await sql`
            SELECT DATE(created_at) AS date, COUNT(*)::int AS new_users
            FROM users WHERE created_at >= NOW() - INTERVAL '30 days'
            GROUP BY DATE(created_at) ORDER BY date
          `;

          const badgeStats = await sql`
            SELECT badge_id, COUNT(*)::int AS times_earned
            FROM user_badges GROUP BY badge_id ORDER BY times_earned DESC
          `;

          return res.status(200).json({
            overview: overview[0], passRate: passRateData[0]?.overall_pass_rate || 0,
            moduleStats, topPerformers, recentActivity, registrationTrend, badgeStats,
          });
        }

        default:
          return res.status(400).json({ error: 'Invalid action' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // ===== POST ACTIONS =====
  if (req.method === 'POST') {
    const body = req.body;

    try {
      switch (action) {
        case 'delete-user': {
          const { userId } = body;
          if (!userId) return res.status(400).json({ error: 'userId required' });
          if (String(userId) === String(adminUserId)) return res.status(400).json({ error: 'Cannot delete yourself' });
          await sql`DELETE FROM user_badges WHERE user_id = ${userId}`;
          await sql`DELETE FROM scores WHERE user_id = ${userId}`;
          const result = await sql`DELETE FROM users WHERE id = ${userId} RETURNING id, username`;
          if (result.length === 0) return res.status(404).json({ error: 'User not found' });
          return res.status(200).json({ message: 'User deleted', deleted: result[0] });
        }
        case 'promote-user': {
          const { userId } = body;
          if (!userId) return res.status(400).json({ error: 'userId required' });
          await sql`UPDATE users SET role = 'admin' WHERE id = ${userId}`;
          return res.status(200).json({ message: 'User promoted to admin' });
        }
        case 'demote-user': {
          const { userId } = body;
          if (!userId) return res.status(400).json({ error: 'userId required' });
          if (String(userId) === String(adminUserId)) return res.status(400).json({ error: 'Cannot demote yourself' });
          await sql`UPDATE users SET role = 'user' WHERE id = ${userId}`;
          return res.status(200).json({ message: 'User demoted' });
        }
        case 'reset-user-scores': {
          const { userId } = body;
          if (!userId) return res.status(400).json({ error: 'userId required' });
          await sql`DELETE FROM scores WHERE user_id = ${userId}`;
          return res.status(200).json({ message: 'Scores reset' });
        }
        case 'reset-all-scores': {
          await sql`DELETE FROM scores`;
          return res.status(200).json({ message: 'All scores reset' });
        }
        case 'delete-all-users': {
          await sql`DELETE FROM user_badges WHERE user_id != ${adminUserId}`;
          await sql`DELETE FROM scores WHERE user_id != ${adminUserId}`;
          await sql`DELETE FROM users WHERE id != ${adminUserId}`;
          return res.status(200).json({ message: 'All users deleted except you' });
        }
        default:
          return res.status(400).json({ error: 'Invalid action' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}