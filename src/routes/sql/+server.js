import pool from '$lib/server/database.js';
 

function checkAuth(request) {
    const auth = request.headers.get('authorization');
    if (!auth || !auth.startsWith('Basic ')) return false;

    const [user, pass] = atob(auth.split(' ')[1]).split(':');
    return user === env.API_USER && pass === env.API_PASSWORT;
}
