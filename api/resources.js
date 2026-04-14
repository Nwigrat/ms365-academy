import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  const adminUserId = req.headers['x-admin-user-id'];
  if (!adminUserId) return res.status(401).json({ error: 'Auth required' });

  const adminCheck = await sql`SELECT role FROM users WHERE id = ${adminUserId}`;
  if (adminCheck.length === 0 || adminCheck[0].role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  if (req.method === 'POST') {
    const { moduleId, icon, title, description, url } = req.body;
    if (!moduleId || !title) return res.status(400).json({ error: 'moduleId and title required' });

    try {
      const maxOrder = await sql`
        SELECT COALESCE(MAX(sort_order), 0)::int AS max FROM resources WHERE module_id = ${moduleId}
      `;
      const result = await sql`
        INSERT INTO resources (module_id, icon, title, description, url, sort_order)
        VALUES (${moduleId}, ${icon || '📖'}, ${title}, ${description || ''}, ${url || ''}, ${maxOrder[0].max + 1})
        RETURNING *
      `;
      return res.status(201).json({ resource: result[0] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    const { id, icon, title, description, url } = req.body;
    if (!id) return res.status(400).json({ error: 'Resource id required' });

    try {
      await sql`
        UPDATE resources
        SET icon = COALESCE(${icon}, icon),
            title = COALESCE(${title}, title),
            description = COALESCE(${description}, description),
            url = COALESCE(${url}, url)
        WHERE id = ${id}
      `;
      return res.status(200).json({ message: 'Resource updated' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Resource id required' });

    try {
      await sql`DELETE FROM resources WHERE id = ${id}`;
      return res.status(200).json({ message: 'Resource deleted' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}