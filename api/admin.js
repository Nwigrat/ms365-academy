import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  // Get admin user ID from header (sent by frontend)
  const adminUserId = req.headers['x-admin-user-id'];

  if (!adminUserId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Verify the requesting user is actually an admin
  const adminCheck = await sql`
    SELECT role FROM users WHERE id = ${adminUserId}
  `;

  if (adminCheck.length === 0 || adminCheck[0].role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  // Handle different HTTP methods
  if (req.method === 'GET') {
    return handleGet(req, res, sql);
  } else if (req.method === 'POST') {
    return handlePost(req, res, sql, adminUserId);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGet(req, res, sql) {
  const { action } = req.query;

  try {
    switch (action) {
      case 'list-users': {
        const users = await sql`
          SELECT
            u.id,
            u.first_name,
            u.last_name,
            u.username,
            u.role,
            u.created_at,
            COALESCE(SUM(s.best_score), 0)::int AS total_score,
            COUNT(CASE WHEN s.passed = true THEN 1 END)::int AS modules_completed,
            COALESCE(SUM(s.quiz_attempts), 0)::int AS total_attempts
          FROM users u
          LEFT JOIN scores s ON u.id = s.user_id
          GROUP BY u.id, u.first_name, u.last_name, u.username, u.role, u.created_at
          ORDER BY u.created_at DESC
        `;
        return res.status(200).json({ users });
      }

      case 'list-scores': {
        const scores = await sql`
          SELECT s.*, u.username, u.first_name, u.last_name
          FROM scores s
          JOIN users u ON s.user_id = u.id
          ORDER BY u.username, s.module_id
        `;
        return res.status(200).json({ scores });
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

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function handlePost(req, res, sql, adminUserId) {
  const { action } = req.query;
  const body = req.body;

  try {
    switch (action) {
      case 'delete-user': {
        const { userId } = body;
        if (!userId) return res.status(400).json({ error: 'userId is required' });

        // Prevent self-deletion
        if (String(userId) === String(adminUserId)) {
          return res.status(400).json({ error: 'You cannot delete yourself' });
        }

        await sql`DELETE FROM scores WHERE user_id = ${userId}`;
        const result = await sql`
          DELETE FROM users WHERE id = ${userId} RETURNING id, username
        `;
        if (result.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ message: `User deleted`, deleted: result[0] });
      }

      case 'promote-user': {
        const { userId } = body;
        if (!userId) return res.status(400).json({ error: 'userId is required' });

        await sql`UPDATE users SET role = 'admin' WHERE id = ${userId}`;
        return res.status(200).json({ message: 'User promoted to admin' });
      }

      case 'demote-user': {
        const { userId } = body;
        if (!userId) return res.status(400).json({ error: 'userId is required' });

        // Prevent self-demotion
        if (String(userId) === String(adminUserId)) {
          return res.status(400).json({ error: 'You cannot demote yourself' });
        }

        await sql`UPDATE users SET role = 'user' WHERE id = ${userId}`;
        return res.status(200).json({ message: 'User demoted to regular user' });
      }

      case 'reset-user-scores': {
        const { userId } = body;
        if (!userId) return res.status(400).json({ error: 'userId is required' });

        await sql`DELETE FROM scores WHERE user_id = ${userId}`;
        return res.status(200).json({ message: 'User scores reset' });
      }

      case 'reset-all-scores': {
        await sql`DELETE FROM scores`;
        return res.status(200).json({ message: 'All scores reset' });
      }

      case 'delete-all-users': {
        await sql`DELETE FROM scores`;
        // Keep the requesting admin
        await sql`DELETE FROM users WHERE id != ${adminUserId}`;
        return res.status(200).json({ message: 'All users deleted (except you)' });
      }

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}