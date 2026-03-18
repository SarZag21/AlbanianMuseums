import pool from '$lib/server/database.js';
import { API_USER, API_PASS } from '$env/static/private';

/* Checks Basic Authentication (username & password) */
function checkAuth(request) {
    const auth = request.headers.get('Authorization');

    // Extract and decode Basic Auth credentials, then compare with ENV variables
    if (!auth?.startsWith('Basic ')) return false;
    const base64 = auth.slice(6);
    const decoded = atob(base64);
    const [user, pass] = decoded.split(':');

    return user === API_USER && pass === API_PASS;
}

/* This function is used to return one museum based on the ID */
export async function GET({ params }) {
    const { id } = params;

    const [rows] = await pool.query(
        'SELECT * FROM Museums WHERE id = ?',
        [id]
    );

    // If no museum is found then return 404, otherwise return the museum
    if (rows.length === 0) {
        return Response.json(
            { message: 'Museum not found' },
            { status: 404 }
        );
    }

    return Response.json(rows[0], { status: 200 });
}

/* This function is used to updates a museum  */
export async function PUT({ params, request }) {

    if (!checkAuth(request)) {
        return Response.json(
            { message: 'Unauthorized' },
            { status: 401 }
        );
    }

    // Extract ID from URL params and data from request body
    const { id } = params;
    const { name, location, type, description } = await request.json();

    if (!name || !location || !type || !description) {
        return Response.json(
            { message: 'Missing required fields' },
            { status: 400 }
        );
    }

    const [result] = await pool.query(
        'UPDATE Museums SET name = ?, location = ?, type = ?, description = ? WHERE id = ?',
        [name, location, type, description, id]
    );

    if (result.affectedRows === 0) {
        return Response.json(
            { message: 'Museum not found' },
            { status: 404 }
        );
    }

    return Response.json(
        { message: 'Museum updated' },
        { status: 200 }
    );
}

/* This function is used to delete a museum */
export async function DELETE({ params, request }) {

    if (!checkAuth(request)) {
        return Response.json(
            { message: 'Unauthorized' },
            { status: 401 }
        );
    }

    const { id } = params;

    const [result] = await pool.query(
        'DELETE FROM Museums WHERE id = ?',
        [id]
    );

    if (result.affectedRows === 0) {
        return Response.json(
            { message: 'Museum not found' },
            { status: 404 }
        );
    }

    // When successfully deleted , no content returned (204)
    return new Response(null, { status: 204 });
}