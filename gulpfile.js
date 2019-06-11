const gulp = require('gulp');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
// const commonjs = require('rollup-plugin-commonjs');
const minify = require('rollup-plugin-minify-es');
const uglify = require('uglify-es').minify;
const cond = require('rollup-plugin-conditional');

let cache;

const buildClient = async (options = {}) => {
  const bundle = await rollup.rollup({
    input: {
      'tv-app': 'src/options/components/tv-app.js',
    },
    cache: cache,
    plugins:  [
      resolve(),
      cond(options.minify, [
        minify({
          mangle: { toplevel: true }
        }, uglify),
      ])
    ]
  });

  cache = bundle.cache;

  await bundle.write({
    dir: 'src/options/dist',
    format: 'esm',
    sourcemap: options.minify ? false : 'inline'
  });
};

gulp.task('dev', async () => {
  await buildClient();
  gulp.watch([ 'src/options/components/**' ], buildClient);
});

gulp.task('build', async () => {
  await buildClient({ minify: true });
});
