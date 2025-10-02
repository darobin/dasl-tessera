#!/usr/bin/env node

import { argv } from 'node:process';
import * as esbuild from 'esbuild';

const isWatch = argv[2] === '--watch';
const appOptions = {
  entryPoints: ['src/tessera.js'],
  bundle: true,
  outfile: 'src/tessera.min.js',
  format: 'esm',
  sourcemap: isWatch,
  // plugins: [wasmLoader()],
};

if (isWatch) {
  const appCtx = await esbuild.context(appOptions);
  await appCtx.watch();
}
else {
  esbuild.build(appOptions);
}
