import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);
  const { action, id, moduleId } = req.query;

  // Helper to check admin
  async function requireAdmin() {
    const adminUserId = req.headers['x-admin-user-id'];
    if (!adminUserId) return false;
    const check = await sql`SELECT role FROM users WHERE id = ${adminUserId}`;
    return check.length > 0 && check[0].role === 'admin';
  }

  // ===== MODULES =====
  if (!action || action === 'modules') {
    if (req.method === 'GET') {
      try {
        if (id) {
          const modules = await sql`SELECT * FROM modules WHERE id = ${id}`;
          if (modules.length === 0) return res.status(404).json({ error: 'Module not found' });

          const resources = await sql`SELECT * FROM resources WHERE module_id = ${id} ORDER BY sort_order`;
          const questions = await sql`SELECT * FROM questions WHERE module_id = ${id} ORDER BY sort_order`;

          return res.status(200).json({
            module: {
              ...modules[0], resources,
              questions: questions.map(q => ({
                id: q.id, q: q.question_text,
                o: [q.option_a, q.option_b, q.option_c, q.option_d],
                a: q.correct_answer,
              })),
            }
          });
        }

        const modules = await sql`
          SELECT m.*,
            (SELECT COUNT(*)::int FROM resources r WHERE r.module_id = m.id) AS resource_count,
            (SELECT COUNT(*)::int FROM questions q WHERE q.module_id = m.id) AS question_count
          FROM modules m WHERE m.is_active = true ORDER BY m.sort_order
        `;
        return res.status(200).json({ modules });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    if (!(await requireAdmin())) return res.status(403).json({ error: 'Admin required' });

    if (req.method === 'POST') {
      const { id: modId, icon, title, description } = req.body;
      if (!modId || !title) return res.status(400).json({ error: 'id and title required' });
      try {
        const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), 0)::int AS max FROM modules`;
        await sql`INSERT INTO modules (id, icon, title, description, sort_order, is_active)
          VALUES (${modId.toLowerCase().replace(/\s+/g, '-')}, ${icon || '📘'}, ${title}, ${description || ''}, ${maxOrder[0].max + 1}, true)`;
        return res.status(201).json({ message: 'Module created' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    if (req.method === 'PUT') {
      const { id: modId, icon, title, description, is_active } = req.body;
      if (!modId) return res.status(400).json({ error: 'id required' });
      try {
        await sql`UPDATE modules SET icon = COALESCE(${icon}, icon), title = COALESCE(${title}, title),
          description = COALESCE(${description}, description), is_active = COALESCE(${is_active}, is_active) WHERE id = ${modId}`;
        return res.status(200).json({ message: 'Module updated' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'id required' });
      try {
        await sql`DELETE FROM scores WHERE module_id = ${id}`;
        await sql`DELETE FROM modules WHERE id = ${id}`;
        return res.status(200).json({ message: 'Module deleted' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  // ===== QUESTIONS =====
  if (action === 'questions') {
    if (!(await requireAdmin())) return res.status(403).json({ error: 'Admin required' });

    if (req.method === 'POST') {
      const { moduleId: mId, questionText, optionA, optionB, optionC, optionD, correctAnswer } = req.body;
      if (!mId || !questionText || !optionA || !optionB || !optionC || !optionD || correctAnswer === undefined) {
        return res.status(400).json({ error: 'All fields required' });
      }
      try {
        const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), 0)::int AS max FROM questions WHERE module_id = ${mId}`;
        const result = await sql`INSERT INTO questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order)
          VALUES (${mId}, ${questionText}, ${optionA}, ${optionB}, ${optionC}, ${optionD}, ${correctAnswer}, ${maxOrder[0].max + 1}) RETURNING *`;
        return res.status(201).json({ question: result[0] });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    if (req.method === 'PUT') {
      const { id: qId, questionText, optionA, optionB, optionC, optionD, correctAnswer } = req.body;
      if (!qId) return res.status(400).json({ error: 'Question id required' });
      try {
        await sql`UPDATE questions SET question_text = COALESCE(${questionText}, question_text),
          option_a = COALESCE(${optionA}, option_a), option_b = COALESCE(${optionB}, option_b),
          option_c = COALESCE(${optionC}, option_c), option_d = COALESCE(${optionD}, option_d),
          correct_answer = COALESCE(${correctAnswer}, correct_answer) WHERE id = ${qId}`;
        return res.status(200).json({ message: 'Question updated' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'Question id required' });
      try {
        await sql`DELETE FROM questions WHERE id = ${id}`;
        return res.status(200).json({ message: 'Question deleted' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  // ===== RESOURCES =====
  if (action === 'resources') {
    if (!(await requireAdmin())) return res.status(403).json({ error: 'Admin required' });

    if (req.method === 'POST') {
      const { moduleId: mId, icon, title, description, url } = req.body;
      if (!mId || !title) return res.status(400).json({ error: 'moduleId and title required' });
      try {
        const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), 0)::int AS max FROM resources WHERE module_id = ${mId}`;
        const result = await sql`INSERT INTO resources (module_id, icon, title, description, url, sort_order)
          VALUES (${mId}, ${icon || '📖'}, ${title}, ${description || ''}, ${url || ''}, ${maxOrder[0].max + 1}) RETURNING *`;
        return res.status(201).json({ resource: result[0] });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    if (req.method === 'PUT') {
      const { id: rId, icon, title, description, url } = req.body;
      if (!rId) return res.status(400).json({ error: 'Resource id required' });
      try {
        await sql`UPDATE resources SET icon = COALESCE(${icon}, icon), title = COALESCE(${title}, title),
          description = COALESCE(${description}, description), url = COALESCE(${url}, url) WHERE id = ${rId}`;
        return res.status(200).json({ message: 'Resource updated' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ error: 'Resource id required' });
      try {
        await sql`DELETE FROM resources WHERE id = ${id}`;
        return res.status(200).json({ message: 'Resource deleted' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }

  return res.status(400).json({ error: 'Invalid action' });
}