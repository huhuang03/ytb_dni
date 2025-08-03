import fg from 'fast-glob';
import path from 'path';
import fs from 'fs-extra';

export function customCopy(options) {
  const {
    patterns,
    exclude,
    rootDir = process.cwd(),
    destDir,
  } = options;

  if (!patterns || !destDir) {
    throw new Error('rollup-plugin-custom-copy: "patterns" and "destDir" are required options.');
  }

  return {
    name: 'custom-copy',

    async buildStart() {
      const files = await fg(patterns, {
        cwd: rootDir,
        ignore: exclude || [],
        dot: true,
        onlyFiles: true,
      });

      for (const file of files) {
        const srcPath = path.resolve(rootDir, file);
        const destPath = path.resolve(destDir, file);
        await fs.ensureDir(path.dirname(destPath));
        await fs.copyFile(srcPath, destPath);
        this.warn(`custom-copy: Copied ${file}`);
      }
    }
  };
}
