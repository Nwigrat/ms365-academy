import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  const adminUserId = req.headers['x-admin-user-id'];
  if (!adminUserId) return res.status(401).json({ error: 'Auth required' });

  const adminCheck = await sql`SELECT role FROM users WHERE id = ${adminUserId}`;
  if (adminCheck.length === 0 || adminCheck[0].role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  if (req.method === 'GET') {
    const { moduleId } = req.query;
    if (!moduleId) return res.status(400).json({ error: 'moduleId required' });

    try {
      const questions = await sql`
        SELECT * FROM questions WHERE module_id = ${moduleId} ORDER BY sort_order
      `;
      return res.status(200).json({ questions });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    const { moduleId, questionText, optionA, optionB, optionC, optionD, correctAnswer } = req.body;

    if (!moduleId || !questionText || !optionA || !optionB || !optionC || !optionD || correctAnswer === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const maxOrder = await sql`
        SELECT COALESCE(MAX(sort_order), 0)::int AS max FROM questions WHERE module_id = ${moduleId}
      `;
      const result = await sql`
        INSERT INTO questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, sort_order)
        VALUES (${moduleId}, ${questionText}, ${optionA}, ${optionB}, ${optionC}, ${optionD}, ${correctAnswer}, ${maxOrder[0].max + 1})
        RETURNING *
      `;
      return res.status(201).json({ question: result[0] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    const { id, questionText, optionA, optionB, optionC, optionD, correctAnswer } = req.body;
    if (!id) return res.status(400).json({ error: 'Question id required' });

    try {
      await sql`
        UPDATE questions
        SET question_text = COALESCE(${questionText}, question_text),
            option_a = COALESCE(${optionA}, option_a),
            option_b = COALESCE(${optionB}, option_b),
            option_c = COALESCE(${optionC}, option_c),
            option_d = COALESCE(${optionD}, option_d),
            correct_answer = COALESCE(${correctAnswer}, correct_answer)
        WHERE id = ${id}
      `;
      return res.status(200).json({ message: 'Question updated' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Question id required' });

    try {
      await sql`DELETE FROM questions WHERE id = ${id}`;
      return res.status(200).json({ message: 'Question deleted' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}