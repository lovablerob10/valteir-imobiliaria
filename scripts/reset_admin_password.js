const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function resetPassword() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    const email = 'goo360brasilmcc@gmail.com';
    const newPassword = 'Valteir@2026';

    try {
        await client.connect();
        console.log("Conectado ao PostgreSQL");

        // Usando a extensão pgcrypto do Supabase para gerar o hash BCrypt
        const query = {
            text: `
                UPDATE auth.users 
                SET encrypted_password = crypt($1, gen_salt('bf'))
                WHERE email = $2
                RETURNING id;
            `,
            values: [newPassword, email],
        };

        const res = await client.query(query);

        if (res.rowCount > 0) {
            console.log(`✅ Senha resetada com sucesso para: ${email}`);
            console.log(`Nova senha temporária: ${newPassword}`);
        } else {
            console.error(`❌ Usuário não encontrado no auth.users: ${email}`);
        }
    } catch (err) {
        console.error("❌ Erro ao resetar senha:", err.message);
        if (err.message.includes("permission denied")) {
            console.log("Dica: O link do DATABASE_URL pode não ter permissão direta na tabela auth.users.");
        }
    } finally {
        await client.end();
    }
}

resetPassword();
