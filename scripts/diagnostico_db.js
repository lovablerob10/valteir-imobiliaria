const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Carrega .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Variáveis de ambiente não encontradas no .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnostico() {
    console.log(`\n🔍 Iniciando diagnóstico...`);
    console.log(`🌐 URL: ${supabaseUrl}`);

    // 1. Testar conexão básica
    console.log("\n1. Testando conexão básica...");
    const { data: authTest, error: authError } = await supabase.auth.getSession();
    if (authError) {
        console.error("❌ Erro ao conectar ao Auth:", authError.message);
    } else {
        console.log("✅ Conexão com Auth estabelecida.");
    }

    // 2. Testar tabela imoveis
    console.log("\n2. Consultando tabela 'imoveis'...");
    const { data: imoveis, error: imoveisError, count } = await supabase
        .from('imoveis')
        .select('*', { count: 'exact', head: true });

    if (imoveisError) {
        console.error("❌ Erro na tabela 'imoveis':");
        console.error(`   - Código: ${imoveisError.code}`);
        console.error(`   - Mensagem: ${imoveisError.message}`);
        console.error(`   - Detalhes: ${imoveisError.details}`);
        console.error(`   - Dica: ${imoveisError.hint}`);
    } else {
        console.log(`✅ Tabela 'imoveis' acessível.`);
        console.log(`📊 Total de registros encontrados: ${count}`);
    }

    // 3. Testar filtros específicos da Home
    console.log("\n3. Testando filtros da Home (status='ativo', destaque=true)...");
    const { count: filteredCount, error: filterError } = await supabase
        .from('imoveis')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativo')
        .eq('destaque', true);

    if (filterError) {
        console.error("❌ Erro nos filtros:", filterError.message);
    } else {
        console.log(`📊 Registros que apareceriam na Home: ${filteredCount}`);
    }

    console.log("\n--- Fim do Diagnóstico ---\n");
}

diagnostico();
