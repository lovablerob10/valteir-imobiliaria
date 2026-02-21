import fs from 'fs';
import path from 'path';

console.log('--- Formatando a saída do OpenNext para Cloudflare Pages Advanced Mode ---');

const openNextDir = '.open-next';
const assetsDir = path.join(openNextDir, 'assets');

// 1. Copiar _worker.js (renomeado de worker.js) para dentro de /assets
//    Pages Advanced Mode: _worker.js DEVE estar na raiz do output directory
//    E os assets estáticos ficam ao lado dele
const workerSrc = path.join(openNextDir, 'worker.js');
const workerDest = path.join(assetsDir, '_worker.js');

try {
    fs.copyFileSync(workerSrc, workerDest);
    console.log('✓ worker.js copiado para assets/_worker.js');
} catch (e) {
    console.error('Erro ao copiar worker.js:', e.message);
}

// 2. Copiar as pastas que o worker.js importa para dentro de /assets
//    O worker.js faz import de:
//    - ./cloudflare/images.js
//    - ./cloudflare/init.js
//    - ./cloudflare/skew-protection.js
//    - ./middleware/handler.mjs
//    - ./.build/durable-objects/...
//    - ./server-functions/default/handler.mjs
const dirsToLink = ['cloudflare', 'middleware', '.build', 'server-functions', 'cloudflare-templates', 'dynamodb-provider', 'cache'];

dirsToLink.forEach(dir => {
    const src = path.join(openNextDir, dir);
    const dest = path.join(assetsDir, dir);

    if (fs.existsSync(src)) {
        // Remove destino se já existir
        if (fs.existsSync(dest)) {
            fs.rmSync(dest, { recursive: true, force: true });
        }
        // Copia a pasta inteira
        fs.cpSync(src, dest, { recursive: true });
        console.log(`✓ Pasta ${dir}/ copiada para assets/${dir}/`);
    }
});

console.log('--- Formatação Concluída! ---');
