import fs from 'fs';
import path from 'path';

console.log('--- Formatando a saída do OpenNext para Cloudflare Pages Advanced Mode ---');

const openNextDir = '.open-next';
const assetsDir = path.join(openNextDir, 'assets');
const workerSrc = path.join(openNextDir, 'worker.js');
const workerDest = path.join(openNextDir, '_worker.js');

// 1. Renomear worker.js para _worker.js (exigido pelo Cloudflare Pages Advanced Mode)
try {
    if (fs.existsSync(workerSrc)) {
        fs.renameSync(workerSrc, workerDest);
        console.log('✓ worker.js renomeado para _worker.js');
    }
} catch (e) {
    console.error('Erro ao renomear worker.js:', e.message);
}

// 2. Copiar todos os arquivos/pastas de .open-next/assets/ para a raiz .open-next/
//    Isso garante que /_next/static/* fique acessível em .open-next/_next/static/*
try {
    if (fs.existsSync(assetsDir)) {
        const items = fs.readdirSync(assetsDir);
        let count = 0;
        for (const item of items) {
            const src = path.join(assetsDir, item);
            const dest = path.join(openNextDir, item);
            if (!fs.existsSync(dest)) {
                fs.cpSync(src, dest, { recursive: true });
                count++;
            }
        }
        console.log(`✓ Extraídos ${count} arquivos/pastas de /assets para a raiz /${openNextDir}/`);
    }
} catch (e) {
    console.error('Erro ao copiar assets:', e.message);
}

console.log('--- Formatação Concluída! ---');
