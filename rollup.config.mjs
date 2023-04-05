import ts from 'rollup-plugin-ts';
import resolve from '@rollup/plugin-node-resolve';
import {copy} from '@web/rollup-plugin-copy';

const commonOutput = {
  'dir': 'dist',
};

export default {
  input: {
    'add_not_interested': 'src/add_not_interested.ts',
  },
  output: {
    ...commonOutput,
    format: 'iife',
    entryFileNames: '[name].js',
  },
  plugins: [
    copy({
      patterns: '**/*',
      exclude: ['*.ts'],
      rootDir: 'src/',
    }),
    ts(),
    resolve(),
  ],
};
