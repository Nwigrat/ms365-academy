import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  if (req.method === 'GET') {
    try {
      const { id } = req.query;

      if (id) {
        const modules = await sql`SELECT * FROM modules WHERE id = ${id}`;
        if (modules.length === 0) return res.status(404).json({ error: 'Module not found' });

        const resources = await sql`
          SELECT * FROM resources WHERE module_id = ${id} ORDER BY sort_order
        `;
        const questions = await sql`
          SELECT * FROM questions WHERE module_id = ${id} ORDER BY sort_order
        `;

        return res.status(200).json({
          module: {
            ...modules[0],
            resources,
            questions: questions.map(q => ({
              id: q.id,
              q: q.question_text,
              o: [q.option_a, q.option_b, q.option_c, q.option_d],
              a: q.correct_answer,
            })),
          }
        });
      }

      const modules = await sql`
        SELECT
          m.*,
          (SELECT COUNT(*)::int FROM resources r WHERE r.module_id = m.id) AS resource_count,
          (SELECT COUNT(*)::int FROM questions q WHERE q.module_id = m.id) AS question_count
        FROM modules m
        WHERE m.is_active = true
        ORDER BY m.sort_order
      `;

      return res.status(200).json({ modules });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // POST/PUT/DELETE require admin
  const adminUserId = req.headers['x-admin-user-id'];
  if (!adminUserId) return res.status(401).json({ error: 'Auth required' });

  const adminCheck = await sql`SELECT role FROM users WHERE id = ${adminUserId}`;
  if (adminCheck.length === 0 || adminCheck[0].role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  if (req.method === 'POST') {
    const { id, icon, title, description } = req.body;
    if (!id || !title) return res.status(400).json({ error: 'id and title are required' });

    try {
      const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), 0)::int AS max FROM modules`;
      await sql`
        INSERT INTO modules (id, icon, title, description, sort_order, is_active)
        VALUES (${id.toLowerCase().replace(/\s+/g, '-')}, ${icon || '📘'}, ${title}, ${description || ''}, ${maxOrder[0].max + 1}, true)
      `;
      return res.status(201).json({ message: 'Module created' });
    } catch (error) {
      if (error.message.includes('duplicate')) {
        return res.status(409).json({ error: 'Module ID already exists' });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    const { id, icon, title, description, is_active } = req.body;
    if (!id) return res.status(400).json({ error: 'id is required' });

    try {
      await sql`
        UPDATE modules
        SET icon = COALESCE(${icon}, icon),
            title = COALESCE(${title}, title),
            description = COALESCE(${description}, description),
            is_active = COALESCE(${is_active}, is_active)
        WHERE id = ${id}
      `;
      return res.status(200).json({ message: 'Module updated' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id is required' });

    try {
      await sql`DELETE FROM scores WHERE module_id = ${id}`;
      await sql`DELETE FROM modules WHERE id = ${id}`;
      return res.status(200).json({ message: 'Module deleted' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}