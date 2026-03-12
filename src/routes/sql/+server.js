import pool from '$lib/server/database.js';

export async function GET() {
    const [rows] = await pool.query('SELECT * FROM Museums');
    return Response.json(rows, { status: 200 });
}

export async function POST({ request }) {
    const { id, name, location, type, description } = await request.json();

    if (!id || !name || !location || !type || !description) {
        return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const [result] = await pool.query(
        'INSERT INTO Museums (id, name, location, type, description) VALUES (?, ?, ?, ?, ?)',
        [id, name, location, type, description]
    );

    return Response.json(
        { message: 'Museum created', id: id },
        { status: 201 }
    );
}