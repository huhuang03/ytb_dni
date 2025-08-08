import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import { customCopy } from './rollup_plugin/rollup-plugin-custom-copy.mjs'
import path from 'path'

const target = process.env.TARGET || 'chrome'  // 默认 chrome
const outDir = path.resolve(`dist/${target}`)
const isFirefox = target === 'firefox'
const manifestFile = isFirefox ?
    'manifest.firefox.json' :
    'manifest.chrome.json'

import fs from 'fs'

/** 自定义插件：拷贝 manifest.xxx.json → dist/.../manifest.json */
function copyManifest({ from, to }) {
  return {
    name: 'copy-manifest',
    buildStart() {
      fs.mkdirSync(path.dirname(to), { recursive: true })
      fs.copyFileSync(from, to)
      console.log(`✔ Copied manifest: ${from} → ${to}`)
    }
  }
}

const commonPlugins = [
  typescript(),
  resolve()
]

export default [
  {
    input: 'src/add_not_interested.ts',
    output: {
      file: `dist/${target}/add_not_interested.js`,
      format: 'iife',  // 单个文件打包
      name: 'AddNotInterestedBundle'  // 全局变量名称
    },
    plugins: [
      ...commonPlugins,
      customCopy({
        patterns: ['**/*'],
        exclude: ['**/*.ts', 'manifest.*.json'],
        rootDir: 'src/',
        destDir: outDir
      }),
      copyManifest({
        from: `src/${manifestFile}`,
        to: `${outDir}/manifest.json`
      })
    ]
  },
  {
    input: 'src/options.ts',
    output: {
      file: `dist/${target}/options.js`,
      format: 'iife',  // 单个文件打包
      name: 'OptionsBundle'  // 全局变量名称
    },
    plugins: commonPlugins
  },
  {
    input: 'src/background.ts',
    output: {
      file: `dist/${target}/background.js`,
      format: 'iife',  // 单个文件打包
      name: 'OptionsBundle'  // 全局变量名称
    },
    plugins: commonPlugins
  }
]
