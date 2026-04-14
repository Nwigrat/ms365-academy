import { neon } from '@neondatabase/serverless';

// Badge definitions — all badge logic in one place
const BADGE_DEFINITIONS = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete your first quiz",
    icon: "🌟",
    category: "milestone",
    check: (stats) => stats.totalAttempts >= 1,
  },
  {
    id: "first-pass",
    name: "Passing Grade",
    description: "Pass your first quiz",
    icon: "✅",
    category: "milestone",
    check: (stats) => stats.totalPassed >= 1,
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Score 5/5 on any quiz (100 pts + bonus)",
    icon: "💯",
    category: "excellence",
    check: (stats) => stats.hasPerfectScore,
  },
  {
    id: "three-down",
    name: "Halfway There",
    description: "Pass 3 different modules",
    icon: "🎯",
    category: "milestone",
    check: (stats) => stats.totalPassed >= 3,
  },
  {
    id: "completionist",
    name: "Completionist",
    description: "Pass all available modules",
    icon: "🏆",
    category: "milestone",
    check: (stats) => stats.totalPassed >= stats.totalModules && stats.totalModules > 0,
  },
  {
    id: "scholar",
    name: "Scholar",
    description: "Earn 200+ total points",
    icon: "📚",
    category: "points",
    check: (stats) => stats.totalScore >= 200,
  },
  {
    id: "expert",
    name: "Expert",
    description: "Earn 400+ total points",
    icon: "🎓",
    category: "points",
    check: (stats) => stats.totalScore >= 400,
  },
  {
    id: "master",
    name: "M365 Master",
    description: "Earn 600+ total points",
    icon: "👑",
    category: "points",
    check: (stats) => stats.totalScore >= 600,
  },
  {
    id: "persistent",
    name: "Persistent",
    description: "Attempt 10+ quizzes total",
    icon: "🔄",
    category: "dedication",
    check: (stats) => stats.totalAttempts >= 10,
  },
  {
    id: "dedicated",
    name: "Dedicated Learner",
    description: "Attempt 25+ quizzes total",
    icon: "💪",
    category: "dedication",
    check: (stats) => stats.totalAttempts >= 25,
  },
  {
    id: "quick-learner",
    name: "Quick Learner",
    description: "Pass a quiz on your first attempt",
    icon: "⚡",
    category: "excellence",
    check: (stats) => stats.hasFirstAttemptPass,
  },
  {
    id: "well-rounded",
    name: "Well Rounded",
    description: "Attempt a quiz in every module",
    icon: "🌐",
    category: "exploration",
    check: (stats) => stats.modulesAttempted >= stats.totalModules && stats.totalModules > 0,
  },
];

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    try {
      // Get user's unlocked badges
      const unlocked = await sql`
        SELECT badge_id, unlocked_at FROM user_badges WHERE user_id = ${userId}
      `;
      const unlockedIds = unlocked.map(b => b.badge_id);
      const unlockedMap = {};
      unlocked.forEach(b => { unlockedMap[b.badge_id] = b.unlocked_at; });

      // Return all badge definitions with unlock status
      const badges = BADGE_DEFINITIONS.map(badge => ({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        category: badge.category,
        unlocked: unlockedIds.includes(badge.id),
        unlockedAt: unlockedMap[badge.id] || null,
      }));

      return res.status(200).json({
        badges,
        totalBadges: BADGE_DEFINITIONS.length,
        unlockedCount: unlockedIds.length,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    // Check and award badges for a user
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    try {
      // Gather user stats
      const scoresResult = await sql`
        SELECT
          COALESCE(SUM(best_score), 0)::int AS total_score,
          COALESCE(SUM(quiz_attempts), 0)::int AS total_attempts,
          COUNT(CASE WHEN passed = true THEN 1 END)::int AS total_passed,
          COUNT(*)::int AS modules_attempted,
          MAX(CASE WHEN best_score >= 130 THEN 1 ELSE 0 END)::int AS has_perfect_score,
          MAX(CASE WHEN passed = true AND quiz_attempts = 1 THEN 1 ELSE 0 END)::int AS has_first_attempt_pass
        FROM scores
        WHERE user_id = ${userId}
      `;

      const totalModulesResult = await sql`
        SELECT COUNT(*)::int AS count FROM modules WHERE is_active = true
      `;

      const stats = {
        totalScore: scoresResult[0]?.total_score || 0,
        totalAttempts: scoresResult[0]?.total_attempts || 0,
        totalPassed: scoresResult[0]?.total_passed || 0,
        modulesAttempted: scoresResult[0]?.modules_attempted || 0,
        hasPerfectScore: (scoresResult[0]?.has_perfect_score || 0) === 1,
        hasFirstAttemptPass: (scoresResult[0]?.has_first_attempt_pass || 0) === 1,
        totalModules: totalModulesResult[0]?.count || 0,
      };

      // Get already unlocked badges
      const existing = await sql`
        SELECT badge_id FROM user_badges WHERE user_id = ${userId}
      `;
      const existingIds = existing.map(b => b.badge_id);

      // Check each badge
      const newlyUnlocked = [];
      for (const badge of BADGE_DEFINITIONS) {
        if (!existingIds.includes(badge.id) && badge.check(stats)) {
          await sql`
            INSERT INTO user_badges (user_id, badge_id)
            VALUES (${userId}, ${badge.id})
            ON CONFLICT (user_id, badge_id) DO NOTHING
          `;
          newlyUnlocked.push({
            id: badge.id,
            name: badge.name,
            icon: badge.icon,
            description: badge.description,
          });
        }
      }

      return res.status(200).json({
        newlyUnlocked,
        totalUnlocked: existingIds.length + newlyUnlocked.length,
        totalBadges: BADGE_DEFINITIONS.length,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}