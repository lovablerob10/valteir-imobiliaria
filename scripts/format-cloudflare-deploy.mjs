import fs from 'fs';
import path from 'path';

console.log('--- Formatando a saída do OpenNext para Cloudflare Pages Advanced Mode ---');

// 1. Renomeia worker.js para _worker.js
try {
    fs.renameSync('.open-next/worker.js', '.open-next/_worker.js');
    console.log('✓ worker.js renomeado para _worker.js');
} catch (e) {
    console.log('Aviso: _worker.js já existe ou não foi encontrado.');
}

// 2. Extrai de /assets para a raiz
const assetsDir = '.open-next/assets';

if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);

    files.forEach(file => {
        const src = path.join(assetsDir, file);
        const dest = path.join('.open-next', file);

        // Se o destino já existir, remove pra evitar conflito
        if (fs.existsSync(dest)) {
            if (fs.lstatSync(dest).isDirectory()) {
                fs.rmSync(dest, { recursive: true, force: true });
            } else {
                fs.rmSync(dest, { force: true });
            }
        }

        // Move o arquivo ou diretório
        fs.renameSync(src, dest);
    });
    console.log(`✓ Extraídos ${files.length} arquivos/pastas de /assets para a raiz /.open-next/`);
} else {
    console.log('Aviso: Diretório de assets não encontrado (isso é normal se for um build isolado).');
}

console.log('--- Formatação Concluída! ---');
