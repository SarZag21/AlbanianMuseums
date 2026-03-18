import pool from '$lib/server/database.js';

/* This function is used to GET all museums */
export async function GET() {
     // Query database and return all rows
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

import { API_USER, API_PASS } from '$env/static/private';


/* Check Basic Auth credentials from request header */
function checkAuth(request) {
    const auth = request.headers.get('Authorization');
      // Header must start with "Basic "
    if (!auth?.startsWith('Basic ')) return false;

    // This is used to Decode Base64
    const base64 = auth.slice(6);
    const decoded = atob(base64);
    const [user, pass] = decoded.split(':');

      // This is used to compare with environment variables
    return user === API_USER && pass === API_PASS;
}

/* POST create new museum */
export async function POST({ request }) {

     // This function is used to block request if no valid login
    if (!checkAuth(request)) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
    // Extract data from request body 
    const { id, name, location, type, description } = await request.json();

     // This function is used to Validate required fields
    if (!id || !name || !location || !type || !description) {
        return Response.json({ message: 'Missing required fields' }, { status: 400 });
    }

    //  This is used to Insert new museum into database
    const [result] = await pool.query(
        'INSERT INTO Museums (id, name, location, type, description) VALUES (?, ?, ?, ?, ?)',
        [id, name, location, type, description]
    );

     // This is used to return success response
    return Response.json(
        { message: 'Museum created', id: id },
        { status: 201 }
    );
}