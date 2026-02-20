-- ==============================================================================
-- 🚀 SEED DE NOTÍCIAS (CONTEÚDO DE TESTE REALISTA)
-- Execute este script no SQL Editor do Supabase.
-- Garanta que a tabela 'noticias' já foi criada.
-- ==============================================================================

-- 1. LIMPAR DADOS EXISTENTES (Opcional, para evitar duplicatas em testes)
-- DELETE FROM public.noticias;

-- 2. INSERIR NOTÍCIAS (COM TRATAMENTO DE DUPLICATAS)
INSERT INTO public.noticias (
    titulo, slug, resumo, imagem_capa, status, autor, conteudo, meta_title, meta_description
) VALUES 
(
    'Tendências do Mercado Imobiliário em 2026: O que esperar?',
    'tendencias-mercado-imobiliario-2026',
    'Explorando as inovações tecnológicas e o novo conceito de moradia de luxo que está transformando o setor.',
    'https://images.unsplash.com/photo-1628744876497-eb30460be9f6?q=80&w=2070',
    'publicado',
    'Valteir Imobiliária',
    '## O Futuro da Moradia de Luxo\n\nO mercado imobiliário em 2026 está sendo moldado por três pilares fundamentais: tecnologia, sustentabilidade e bem-estar.\n\n### 1. Casas Inteligentes e IA\nA integração da Inteligência Artificial não é mais um diferencial, mas uma necessidade. Sistemas que aprendem a rotina dos moradores para otimizar o consumo de energia e segurança são o novo padrão ouro.\n\n### 2. Espaços Híbridos\nO home office evoluiu para o "home retreat". Espaços dedicados à produtividade que se transformam em áreas de descompressão, com iluminação circadiana e isolamento acústico de alta performance.\n\n### 3. Sustentabilidade como Valor Profundo\nNão se trata apenas de painéis solares, mas de materiais biofílicos e sistemas de reuso de água integrados que valorizam o imóvel para as próximas décadas.',
    'Tendências Imobiliárias 2026 | Valteir Imob',
    'Descubra o que vai valorizar o mercado em 2026. Tecnologia, IA e sustentabilidade no mercado imobiliário de luxo.'
),
(
    'Guia de Financiamento: 5 Dicas para o Seu Primeiro Imóvel',
    'dicas-financiar-primeiro-imovel',
    'Saiba como se preparar financeiramente para conquistar as chaves do seu novo lar sem surpresas.',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070',
    'publicado',
    'Valteir Imobiliária',
    '## Conquistando o Primeiro Imóvel\n\nComprar o primeiro imóvel é um marco na vida de qualquer pessoa. Aqui estão as dicas essenciais para um processo tranquilo.\n\n### Planejamento Financeiro é a Base\nAntes de olhar os imóveis, olhe para sua conta bancária. Ter uma reserva para a entrada (mínimo 20%) é o primeiro passo para conseguir taxas de juros mais amigáveis.\n\n### Documentação em Dia\nA burocracia pode ser o maior inimigo se você não estiver preparado. Certidões negativas, comprovantes de renda e histórico de crédito devem estar organizados antes mesmo da proposta.\n\n### Escolha do Banco e Amortização\nNão aceite a primeira proposta. Compare as taxas dos principais bancos e entenda se o sistema SAC ou PRICE faz mais sentido para o seu fluxo de caixa a longo prazo.',
    'Guia de Financiamento Imobiliário 2026 | Valteir Imob',
    'Passo a passo com 5 dicas fundamentais para financiar seu primeiro imóvel com segurança e economia.'
),
(
    'Vale mais a pena comprar ou alugar? A análise definitiva em 2026',
    'comprar-ou-alugar-analise-2026',
    'Entenda os prós e contras financeiros de cada opção e descubra qual delas se encaixa melhor no seu momento.',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073',
    'publicado',
    'Valteir Imobiliária',
    '## O Grande Dilema: Comprar ou Alugar?\n\nA resposta curta é: depende do seu momento de vida e estratégia financeira.\n\n### Quando Comprar é a Melhor Escolha\nSe você busca estabilidade e tem intenção de permanecer na região por mais de 5 a 10 anos, a compra cria patrimônio a longo prazo. Em cenários de inflação estável, o imóvel se torna um ativo de segurança contra a desvalorização cambial.\n\n### Quando Alugar Faz Mais Sentido\nPara quem busca mobilidade ou prefere investir a diferença da parcela em ativos financeiros com maior liquidez. Em algumas capitais, o valor mensal do aluguel pode ser significativamente menor que os juros de um financiamento, permitindo que a diferença seja reinvestida.\n\n### Conclusão\nCalcule o custo de oportunidade. Na Valteir Imobiliária, ajudamos você a fazer essa conta de forma personalizada, analisando o potencial de valorização do bairro vs o custo locatício.',
    'Comprar ou Alugar? Veja o que é melhor em 2026',
    'Análise financeira estratégica sobre o mercado imobiliário. Saiba se é hora de investir na casa própria ou manter a liquidez.'
)
ON CONFLICT (slug) DO UPDATE SET
    titulo = EXCLUDED.titulo,
    resumo = EXCLUDED.resumo,
    imagem_capa = EXCLUDED.imagem_capa,
    status = EXCLUDED.status,
    autor = EXCLUDED.autor,
    conteudo = EXCLUDED.conteudo,
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    updated_at = now();
