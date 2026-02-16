/**
 * Build to public/ and serve (avoids locked dist folder)
 */
import * as esbuild from 'esbuild';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { spawn } from 'node:child_process';

console.log('🔨 Building to public/...');

if (!existsSync('public/i18n')) mkdirSync('public/i18n', { recursive: true });
cpSync('src/i18n', 'public/i18n', { recursive: true });

await esbuild.build({
  entryPoints: ['src/app.js'],
  outfile: 'public/app.js',
  bundle: true,
  loader: { '.png': 'dataurl' },
  platform: 'browser',
  target: ['es2020'],
  minify: false,
  logLevel: 'info',
});

console.log('✅ Build done. Starting server at http://localhost:3000\n');

const child = spawn('npx', ['serve', 'public', '-l', '3000'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd(),
});
child.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
child.on('exit', (code) => process.exit(code ?? 0));
