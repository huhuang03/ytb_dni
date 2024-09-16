import ts from 'rollup-plugin-ts';
import resolve from '@rollup/plugin-node-resolve';
import {copy} from '@web/rollup-plugin-copy';

const commonPlugins = [
  copy({
    patterns: '**/*',
    exclude: ['*.ts'],
    rootDir: 'src/',
  }),
  ts(),
  resolve(),
];

export default [
  {
    input: 'src/add_not_interested.ts',
    output: {
      file: 'dist/add_not_interested.js',
      format: 'iife',  // 单个文件打包
      name: 'AddNotInterestedBundle',  // 全局变量名称
    },
    plugins: commonPlugins,
  },
  {
    input: 'src/options.ts',
    output: {
      file: 'dist/options.js',
      format: 'iife',  // 单个文件打包
      name: 'OptionsBundle',  // 全局变量名称
    },
    plugins: commonPlugins,
  }
];
