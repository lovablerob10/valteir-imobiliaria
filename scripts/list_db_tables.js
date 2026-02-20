const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function listTables() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log("Conectado ao PostgreSQL");
        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log("Tabelas encontradas:");
        console.table(res.rows);
    } catch (err) {
        console.error("Erro:", err.message);
    } finally {
        await client.end();
    }
}

listTables();
