import fs from 'fs/promises';
import path from 'path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const IMPORT_REGEX = /(from\s+['"])(@\/|src\/)([^'"]+)(['"])/g;

async function processFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let hasChanges = false;

    const updatedContent = content.replace(IMPORT_REGEX, (match, prefix, srcPrefix, modulePath, suffix) => {
      hasChanges = true;
      const fileDir = path.dirname(filePath);
      const targetPath = path.resolve(DIST_DIR, 'src', modulePath);
      let relativePath = path.relative(fileDir, targetPath);

      // Garante que o caminho relativo comece com './' ou '../'
      if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
      }

      // Corrige barras invertidas no Windows
      relativePath = relativePath.replace(/\\/g, '/');

      console.log(`- Em ${path.basename(filePath)}:`);
      console.log(`  - Trocando: '${srcPrefix}${modulePath}'`);
      console.log(`  - Por:      '${relativePath}'\n`);

      return `${prefix}${relativePath}${suffix}`;
    });

    if (hasChanges) {
      await fs.writeFile(filePath, updatedContent, 'utf-8');
    }
  } catch (error) {
    console.error(`Erro ao processar o arquivo ${filePath}:`, error);
  }
}

async function traverseDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      // Ignora node_modules ou outras pastas que não queira processar
      if (entry.name !== 'node_modules') {
        await traverseDir(fullPath);
      }
    } else if (/\.(js|mjs|cjs)$/.test(fullPath)) {
      // Processa arquivos JavaScript compilados
      await processFile(fullPath);
    }
  }
}

async function run() {
  console.log('Iniciando conversão de caminhos de importação...');
  await traverseDir(DIST_DIR);
  console.log('Conversão concluída!');
}

run();