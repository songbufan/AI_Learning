/**
 * postinstall.cjs — 复制 Pyodide 文件到 public/pyodide/
 *
 * 使用 CommonJS 格式，因为 package.json 设置了 "type": "module"，
 * npm scripts 中的内联代码无法使用 require()。
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname);
const destDir = path.join(projectRoot, 'public', 'pyodide');

// 确保目标目录存在
fs.mkdirSync(destDir, { recursive: true });

const filesToCopy = [
  'pyodide.js',
  'pyodide.asm.wasm',
  'pyodide.asm.mjs',
  'pyodide.mjs',
  'python_stdlib.zip',
  'pyodide-lock.json',
];

let copied = 0;
let skipped = 0;

filesToCopy.forEach((file) => {
  const src = path.join(projectRoot, 'node_modules', 'pyodide', file);
  const dest = path.join(destDir, file);

  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    copied++;
    console.log(`  ✓ ${file}`);
  } else {
    skipped++;
    console.log(`  - ${file} (not found in node_modules)`);
  }
});

console.log(`\nPyodide 文件复制完成: ${copied} 个文件已复制, ${skipped} 个跳过`);
if (skipped > 0) {
  console.log('提示: 跳过文件可能需要在运行时从 CDN 加载');
}
