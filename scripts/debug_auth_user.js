require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Note: Normally we'd use service role key for admin actions, 
// but we only have anon key available in environment usually.
// Depending on settings, SignUp might work with Anon key.

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const EMAIL = 'goo360brasilmcc@gmail.com';
const PASSWORD = '@Senha1234';

async function main() {
    console.log(`--- Debugging Auth for: ${EMAIL} ---`);

    // 1. Try Login
    console.log("\n1. Attempting Login...");
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: EMAIL,
        password: PASSWORD
    });

    if (!signInError) {
        console.log("✅ LOGIN SUCCESSFUL!");
        console.log("User ID:", signInData.user.id);
        console.log("Profile Data (should be auto-created):");

        // Check Profile
        const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', signInData.user.id).single();
        console.log(profile || "⚠️ Profile not found (Trigger might have failed)");
        return;
    }

    console.log("❌ Login Failed:", signInError.message);

    if (signInError.message.includes("Invalid login credentials") || signInError.message.includes("Email not confirmed")) {
        console.log("-> User likely exists but password wrong OR email not confirmed.");
        // We can't reset password without email access or service role key
    }

    // 2. Try SignUp (if login failed/user might not exist)
    if (signInError.message.includes("Invalid login credentials")) {
        console.log("\n2. Attempting Sign Up (in case user doesn't exist but error is generic)...");

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: EMAIL,
            password: PASSWORD,
            options: {
                data: {
                    full_name: 'Valteir Adm'
                }
            }
        });

        if (signUpError) {
            console.log("❌ Sign Up Failed:", signUpError.message);
            if (signUpError.message.includes("already registered")) {
                console.log("⚠️ CONCLUSION: User exists, but PASSWORD IS WRONG.");
            }
        } else {
            if (signUpData.user && signUpData.user.identities && signUpData.user.identities.length === 0) {
                console.log("⚠️ User already exists (Sign Up returned no new identity). Password verification failed.");
            } else {
                console.log("✅ SIGN UP SUCCESSFUL! Check your email to confirm if required.");
                console.log("User created with ID:", signUpData.user?.id);
            }
        }
    }
}

main();
