const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function checkUser() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    const emailToSearch = 'goo360brasilmcc@gmail.com';

    try {
        await client.connect();
        console.log("--- Diagnóstico de Acesso ---");

        // 1. Verificar na auth.users
        const userRes = await client.query('SELECT id, email, last_sign_in_at FROM auth.users WHERE email = $1', [emailToSearch]);

        if (userRes.rowCount === 0) {
            console.log(`❌ USUÁRIO NÃO ENCONTRADO em auth.users para o e-mail: ${emailToSearch}`);
            // Listar outros e-mails pra ver se tem erro de digitação
            const allUsers = await client.query('SELECT email FROM auth.users LIMIT 5');
            console.log("E-mails sugeridos no banco:", allUsers.rows.map(r => r.email).join(', '));
        } else {
            const user = userRes.rows[0];
            console.log(`✅ Usuário Encontrado: ${user.email} (ID: ${user.id})`);
            console.log(`Último login: ${user.last_sign_in_at || 'Nunca'}`);

            // 2. Verificar na profiles (ou perfis - conferindo qual tabela existe)
            const tableCheck = await client.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_name IN ('profiles', 'perfis')
            `);
            const tableName = tableCheck.rows[0]?.table_name;

            if (tableName) {
                const profileRes = await client.query(`SELECT * FROM ${tableName} WHERE user_id = $1 OR id = $1`, [user.id]);
                if (profileRes.rowCount > 0) {
                    console.log(`✅ Perfil Encontrado na tabela '${tableName}':`, profileRes.rows[0]);
                } else {
                    console.log(`❌ PERFIL NÃO ENCONTRADO na tabela '${tableName}' para este ID.`);
                }
            } else {
                console.log("❌ Nenhuma tabela de 'profiles' ou 'perfis' encontrada.");
            }
        }

    } catch (err) {
        console.error("❌ Erro no diagnóstico:", err.message);
    } finally {
        await client.end();
    }
}

checkUser();
