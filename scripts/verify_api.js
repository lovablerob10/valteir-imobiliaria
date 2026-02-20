const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = require('dotenv').config({ path: envPath });

// Manual parse fallback
if (envConfig.error) {
    try {
        const envFile = fs.readFileSync(envPath, 'utf8');
        envFile.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) process.env[key.trim()] = value.trim();
        });
    } catch (err) { }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or Key");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log(`Connecting to API: ${supabaseUrl}`);

    // 1. Try to fetch properties to verify image/table status
    console.log("Checking properties...");
    const { data: props, error } = await supabase
        .from('imoveis')
        .select('id, title, slug')
        .ilike('titulo', '%Mansão Suspensa%')
        .limit(1);

    if (error) {
        console.error("Error fetching properties:", error);
    } else {
        console.log("Successfully fetched properties:", props);
    }

    // 2. Check Auth Endpoint
    console.log("Checking Auth endpoint...");
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'wrongpassword'
    });

    if (authError) {
        console.log("Auth response:", authError.message);
    }

    // 3. Check Profiles Table
    console.log("Checking profiles table...");
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (profilesError) {
        console.error("Profiles Table Error:", profilesError);
    } else {
        console.log("Profiles Table EXISTS. Sample:", profiles[0]);
    }
}

verify();
