import pool from '$lib/server/database.js';

function checkAuth(request) {
    const auth = request.headers.get('authorization');
    if (!auth || !auth.startsWith('Basic ')) return false;

    const [user, pass] = atob(auth.split(' ')[1]).split(':');
    return user === 'admin' && pass === 'albania2024';
}

// GET all museums
export async function GET() {
    const [rows] = await pool.query('SELECT * FROM Museums');
    return Response.json(rows, { status: 200 });
}

// POST new museum
export async function POST({ request }) {

    if (!checkAuth(request)) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

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