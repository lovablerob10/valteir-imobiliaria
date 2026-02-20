const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const noticias = [
    {
        titulo: 'Tendências do Mercado Imobiliário em 2026: O que esperar?',
        slug: 'tendencias-mercado-imobiliario-2026',
        resumo: 'Explorando as inovações tecnológicas e o novo conceito de moradia de luxo que está transformando o setor.',
        imagem_capa: 'https://images.unsplash.com/photo-1628744876497-eb30460be9f6?q=80&w=2070',
        status: 'publicado',
        autor: 'Valteir Imobiliária',
        conteudo: '## O Futuro da Moradia de Luxo\n\nO mercado imobiliário em 2026 está sendo moldado por três pilares fundamentais: tecnologia, sustentabilidade e bem-estar.\n\n### 1. Casas Inteligentes e IA\nA integração da Inteligência Artificial não é mais um diferencial, mas uma necessidade. Sistemas que aprendem a rotina dos moradores para otimizar o consumo de energia e segurança são o novo padrão ouro.\n\n### 2. Espaços Híbridos\nO home office evoluiu para o "home retreat". Espaços dedicados à produtividade que se transformam em áreas de descompressão, com iluminação circadiana e isolamento acústico de alta performance.\n\n### 3. Sustentabilidade como Valor Profundo\nNão se trata apenas de painéis solares, mas de materiais biofílicos e sistemas de reuso de água integrados que valorizam o imóvel para as próximas décadas.',
        meta_title: 'Tendências Imobiliárias 2026 | Valteir Imob',
        meta_description: 'Descubra o que vai valorizar o mercado em 2026. Tecnologia, IA e sustentabilidade no mercado imobiliário de luxo.'
    },
    {
        titulo: 'Guia de Financiamento: 5 Dicas para o Seu Primeiro Imóvel',
        slug: 'dicas-financiar-primeiro-imovel',
        resumo: 'Saiba como se preparar financeiramente para conquistar as chaves do seu novo lar sem surpresas.',
        imagem_capa: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070',
        status: 'publicado',
        autor: 'Valteir Imobiliária',
        conteudo: '## Conquistando o Primeiro Imóvel\n\nComprar o primeiro imóvel é um marco na vida de qualquer pessoa. Aqui estão as dicas essenciais para um processo tranquilo.\n\n### Planejamento Financeiro é a Base\nAntes de olhar os imóveis, olhe para sua conta bancária. Ter uma reserva para a entrada (mínimo 20%) é o primeiro passo para conseguir taxas de juros mais amigáveis.\n\n### Documentação em Dia\nA burocracia pode ser o maior inimigo se você não estiver preparado. Certidões negativas, comprovantes de renda e histórico de crédito devem estar organizados antes mesmo da proposta.\n\n### Escolha do Banco e Amortização\nNão aceite a primeira proposta. Compare as taxas dos principais bancos e entenda se o sistema SAC ou PRICE faz mais sentido para o seu fluxo de caixa a longo prazo.',
        meta_title: 'Guia de Financiamento Imobiliário 2026 | Valteir Imob',
        meta_description: 'Passo a passo com 5 dicas fundamentais para financiar seu primeiro imóvel com segurança e economia.'
    },
    {
        titulo: 'Vale mais a pena comprar ou alugar? A análise definitiva em 2026',
        slug: 'comprar-ou-alugar-analise-2026',
        resumo: 'Entenda os prós e contras financeiros de cada opção e descubra qual delas se encaixa melhor no seu momento.',
        imagem_capa: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073',
        status: 'publicado',
        autor: 'Valteir Imobiliária',
        conteudo: '## O Grande Dilema: Comprar ou Alugar?\n\nA resposta curta é: depende do seu momento de vida e estratégia financeira.\n\n### Quando Comprar é a Melhor Escolha\nSe você busca estabilidade e tem intenção de permanecer na região por mais de 5 a 10 anos, a compra cria patrimônio a longo prazo. Em cenários de inflação estável, o imóvel se torna um ativo de segurança contra a desvalorização cambial.\n\n### Quando Alugar Faz Mais Sentido\nPara quem busca mobilidade ou prefere investir a diferença da parcela em ativos financeiros com maior liquidez. Em algumas capitais, o valor mensal do aluguel pode ser significativamente menor que os juros de um financiamento, permitindo que a diferença seja reinvestiva.\n\n### Conclusão\nCalcule o custo de oportunidade. Na Valteir Imobiliária, ajudamos você a fazer essa conta de forma personalizada, analisando o potencial de valorização do bairro vs o custo locatício.',
        meta_title: 'Comprar ou Alugar? Veja o que é melhor em 2026',
        meta_description: 'Análise financeira estratégica sobre o mercado imobiliário. Saiba se é hora de investir na casa própria ou manter a liquidez.'
    }
];

async function seed() {
    const { data, error } = await supabase.from('noticias').upsert(noticias, { onConflict: 'slug' });
    if (error) {
        console.error('Seed failed:', error);
    } else {
        console.log('Seed successful:', data);
    }
}

seed();
