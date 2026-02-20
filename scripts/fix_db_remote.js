const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local manually to avoid dependencies
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = require('dotenv').config({ path: envPath });

if (envConfig.error) {
    console.error("Error loading .env.local:", envConfig.error);
    // Fallback to manual parsing if dotenv fails or isn't installed (though it should be)
    try {
        const envFile = fs.readFileSync(envPath, 'utf8');
        envFile.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
    } catch (err) {
        console.error("Failed to manual parse .env.local", err);
    }
}

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error("DATABASE_URL not found in .env.local");
    process.exit(1);
}

let clientConfig = {};

try {
    // Robust parsing for passwords with special chars like @
    // format: postgresql://user:password@host:port/dbname

    // Remove protocol
    const urlContent = dbUrl.replace('postgresql://', '');

    // Find the last @ to separate auth from host
    const authHostSplitIndex = urlContent.lastIndexOf('@');
    if (authHostSplitIndex === -1) throw new Error("No @ found to separate auth and host");

    const authPart = urlContent.substring(0, authHostSplitIndex);
    const hostPart = urlContent.substring(authHostSplitIndex + 1);

    // Extract user and password
    const userPassSplitIndex = authPart.indexOf(':');
    if (userPassSplitIndex === -1) throw new Error("No : found to separate user and password");

    const user = authPart.substring(0, userPassSplitIndex);
    const password = authPart.substring(userPassSplitIndex + 1);

    // Extract host, port, db
    // hostPart is like host.com:5432/dbname or host.com/dbname
    const dbNameSplitIndex = hostPart.indexOf('/');
    const hostPortPart = dbNameSplitIndex !== -1 ? hostPart.substring(0, dbNameSplitIndex) : hostPart;
    const database = dbNameSplitIndex !== -1 ? hostPart.substring(dbNameSplitIndex + 1) : 'postgres';

    const [host, port] = hostPortPart.split(':');

    clientConfig = {
        user: decodeURIComponent(user),
        password: decodeURIComponent(password),
        host: host,
        port: port ? parseInt(port) : 5432,
        database: database,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000
    };

    console.log(`Parsed config -> Host: ${clientConfig.host}, User: ${clientConfig.user}, DB: ${clientConfig.database}`);

} catch (err) {
    console.error("Manual parsing failed:", err.message);
    console.log("Falling back to connectionString usage.");
    clientConfig = {
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000
    };
}

const client = new Client(clientConfig);

async function runFixes() {
    try {
        await client.connect();
        // Log host only for safety, using clientConfig.host if available, otherwise parsing dbUrl
        const hostToLog = clientConfig.host || (dbUrl.split('@')[1] ? dbUrl.split('@')[1].split(':')[0] : 'unknown');
        console.log("Connected to database:", hostToLog);

        // 1. Fix Auth Trigger
        console.log("Applying Auth Trigger Fix...");
        await client.query(`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger
      LANGUAGE plpgsql
      SECURITY DEFINER SET search_path = public
      AS $$
      BEGIN
        INSERT INTO public.profiles (user_id, email, full_name, role)
        VALUES (
          new.id,
          new.email,
          COALESCE(new.raw_user_meta_data->>'full_name', 'Novo Usuário'),
          'admin_master'::user_role
        )
        ON CONFLICT (user_id) DO UPDATE
        SET
          email = EXCLUDED.email,
          role = 'admin_master'::user_role;
        RETURN new;
      END;
      $$;
    `);

        await client.query(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`);
        await client.query(`
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `);
        console.log("Auth Trigger applied.");

        // 2. Backfill Profiles
        console.log("Backfilling missing profiles...");
        const backfillRes = await client.query(`
      INSERT INTO public.profiles (user_id, email, full_name, role)
      SELECT 
          id, 
          email, 
          COALESCE(raw_user_meta_data->>'full_name', 'Usuário Recuperado'),
          'admin_master'::user_role
      FROM auth.users
      WHERE id NOT IN (SELECT user_id FROM public.profiles)
      ON CONFLICT (user_id) DO NOTHING
      RETURNING id;
    `);
        console.log(`Backfilled ${backfillRes.rowCount} profiles.`);

        // 3. Fix Image
        console.log("Fixing 'Mansão Suspensa' image...");
        // Find the property first to deal with potential title variations
        const propRes = await client.query(`SELECT id, titulo FROM imoveis WHERE titulo ILIKE '%Mansão Suspensa%' LIMIT 1`);

        if (propRes.rows.length > 0) {
            const propId = propRes.rows[0].id;
            console.log(`Found property: ${propRes.rows[0].titulo} (${propId})`);

            await client.query(`
            UPDATE public.imoveis
            SET imagens = ARRAY[
                'https://images.unsplash.com/photo-1600596542815-3ad19b6f6705?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=1200',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200'
            ]
            WHERE id = $1;
        `, [propId]);
            console.log("Images updated.");
        } else {
            console.warn("Property 'Mansão Suspensa' not found in 'imoveis' table on this verification.");
        }

        // 4. Verify User
        console.log("Verifying user goo360brasilmcc@gmail.com...");
        const userRes = await client.query(`
        SELECT u.id, u.email, p.role 
        FROM auth.users u
        LEFT JOIN public.profiles p ON u.id = p.user_id
        WHERE u.email = 'goo360brasilmcc@gmail.com'
    `);

        if (userRes.rows.length > 0) {
            console.log("User found:", userRes.rows[0]);
        } else {
            console.log("User 'goo360brasilmcc@gmail.com' NOT FOUND in auth.users.");
        }

    } catch (e) {
        console.error("Execution failed:", e);
    } finally {
        await client.end();
    }
}

runFixes();
