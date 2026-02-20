const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables for URL (Key is hardcoded from user input for this run to ensure it works)
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
// Using the provided Service Role Key directly
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2cnJtaGF6bWN2cWVrdXZ0dHBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDc2NzE5NiwiZXhwIjoyMDg2MzQzMTk2fQ.ETsBmWHgRbO2gtN1GC0ZKlf_qdPCAlXc7gVhAnvHL_g';

if (!supabaseUrl) {
    console.error("Missing Supabase URL in .env.local");
    process.exit(1);
}

console.log(`Connecting to ${supabaseUrl} with Service Role Key...`);
const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function fixAuth() {
    const email = 'goo360brasilmcc@gmail.com';
    const password = 'Valteir@2024'; // Temporary strong password

    console.log(`\n--- Processing User: ${email} ---`);

    // 1. Check if user exists via Admin API
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error("Failed to list users:", listError);
        return;
    }

    const existingUser = users.find(u => u.email === email);
    let userId;

    if (existingUser) {
        console.log(`User exists (ID: ${existingUser.id}). Updating password...`);
        userId = existingUser.id;

        const { error: updateError } = await supabase.auth.admin.updateUserById(
            userId,
            { password: password, email_confirm: true }
        );

        if (updateError) console.error("Update failed:", updateError);
        else console.log("Password updated successfully.");

    } else {
        console.log("User does not exist. Creating...");
        const { data: createData, error: createError } = await supabase.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: { full_name: 'Robson Nobre (Admin)' }
        });

        if (createError) {
            console.error("Creation failed:", createError);
            return;
        }

        console.log(`User created (ID: ${createData.user.id}).`);
        userId = createData.user.id;
    }

    // 2. Fix Profile (Bypassing RLS/Triggers)
    console.log("\n--- Fixing Profile ---");

    const profileData = {
        user_id: userId,
        email: email,
        full_name: 'Robson Nobre (Admin)',
        role: 'admin_master',
        integration_status: 'active'
    };

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'user_id' })
        .select()
        .single();

    if (profileError) {
        console.error("Profile fix failed:", profileError);
    } else {
        console.log("Profile fixed/created successfully:", profile);
    }

    console.log("\n DONE! Login should work with:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
}

fixAuth();
