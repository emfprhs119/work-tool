import type { BuildOptions } from 'esbuild';
import { build, context } from 'esbuild';
import { htmlPlugin } from '@craftamap/esbuild-plugin-html';
import postCssPlugin from 'esbuild-style-plugin';

const isDev = process.env.NODE_ENV === 'development';

const common: BuildOptions = {
  outdir: 'dist',
  assetNames: 'assets/[name]-[hash]',
  bundle: true,
  minify: !isDev,
  sourcemap: isDev,
  define: {
    DEBUG: isDev ? 'true' : 'false',
  },
  external: ['date-fns/locale'],
};

const main: BuildOptions = {
  ...common,
  entryPoints: ['src/main.ts', 'src/preload.ts'],
  platform: 'node',
  external: ['electron'],
};

const renderer: BuildOptions = {
  ...common,
  entryPoints: ['src/web/index.tsx'],
  platform: 'browser',
  metafile: true,
  loader: {
    '.png': 'file',
    '.svg': 'file',
  },
  plugins: [
    htmlPlugin({
      files: [
        {
          filename: 'index.html',
          entryPoints: ['src/web/index.tsx'],
          htmlTemplate: 'src/web/index.html',
        },
      ],
    }),
    postCssPlugin({
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
    }),
  ],
};

const watch = async () => {
  const mainCtx = await context({ ...main });
  const rendererCtx = await context({ ...renderer });
  await mainCtx.watch();
  await rendererCtx.watch();
};

const prod = async () => {
  await build({ ...main });
  await build({ ...renderer });
};

isDev ? watch() : prod();
