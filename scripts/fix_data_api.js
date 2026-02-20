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
const supabase = createClient(supabaseUrl, supabaseKey);

async function fix() {
    console.log(`Target: ${supabaseUrl}`);

    // 1. Fix Image
    console.log("\n--- Fixing Image ---");
    // Get the property first
    const { data: props, error: fetchError } = await supabase
        .from('imoveis')
        .select('*')
        .ilike('titulo', '%Mansão Suspensa%')
        .limit(1);

    if (fetchError) {
        console.error("Fetch Error:", fetchError);
    } else if (props.length === 0) {
        console.error("Property 'Mansão Suspensa' not found.");
    } else {
        const prop = props[0];
        console.log(`Found: ${prop.titulo} (ID: ${prop.id})`);

        // Try update
        const newImages = [
            'https://images.unsplash.com/photo-1600596542815-3ad19b6f6705?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200'
        ];

        const { error: updateError } = await supabase
            .from('imoveis')
            .update({ imagens: newImages })
            .eq('id', prop.id);

        if (updateError) {
            console.error("Update Failed (Likely RLS):", updateError);
        } else {
            console.log("Image Updated Successfully!");
        }
    }

    // 2. Check/Fix User
    console.log("\n--- Checking User ---");
    const email = 'goo360brasilmcc@gmail.com';
    const tempPassword = 'StartPassword123!';

    // Attempt Sign Up to check existence
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: tempPassword,
        options: {
            data: { full_name: 'Robson Nobre (Recuperado)' }
        }
    });

    if (signUpError) {
        console.log("Sign Up Result:", signUpError.message);
        if (signUpError.message.includes("already registered")) {
            console.log("User EXISTS. Issue is likely correct password.");
        }
    } else if (signUpData.user) {
        console.log("User CREATED successfully! ID:", signUpData.user.id);

        // Since we are logged in as this new user, try to create profile manually
        // in case trigger didn't fire
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                user_id: signUpData.user.id,
                email: email,
                full_name: 'Robson Nobre (Recuperado)',
                role: 'admin_master' // This might fail if RLS prevents setting role
            });

        if (profileError) {
            console.error("Manual Profile Creation Failed:", profileError);
            // Retry without role if that was the blocker
            const { error: profileRetry } = await supabase
                .from('profiles')
                .insert({
                    user_id: signUpData.user.id,
                    email: email,
                    full_name: 'Robson Nobre (Recuperado)'
                });
            if (profileRetry) console.error("Retry Profile Failed:", profileRetry);
            else console.log("Profile Created (without explicit role)!");
        } else {
            console.log("Profile Created Successfully with Admin Role!");
        }
    }
}

fix();
