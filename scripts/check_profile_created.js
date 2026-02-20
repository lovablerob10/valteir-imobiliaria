require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    const userId = "0023c904-f8b2-4eed-8f43-0fad0bc6aaa0"; // ID from previous step
    console.log(`Checking profile for User ID: ${userId}...`);

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) {
        console.log("❌ Profile check failed:", error.message);
        console.log("Possible reasons: Trigger failed OR RLS prevents reading (try login to read own profile)");
    } else {
        console.log("✅ Profile FOUND:", data);
        console.log("Role:", data.role);
    }
}
main();
