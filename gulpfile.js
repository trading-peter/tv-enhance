const gulp = require('gulp');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const minify = require('rollup-plugin-minify-es');
const uglify = require('uglify-es').minify;
const cond = require('rollup-plugin-conditional');
const zip = require('gulp-zip');

let cache;

const buildOptions = async (options = {}) => {
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
  await buildOptions();
  gulp.watch([ 'src/options/components/**' ], buildOptions);
});

gulp.task('build', async () => {
  await buildOptions({ minify: true });
  gulp.src([
    'src/bg/*',
    'src/inject/*',
    'src/options/index.html',
    'src/options/dist/*',
    'icons/*.png',
    '_locales/*',
    'manifest.json',
    'LICENSE'
  ], { base: '.' })
  .pipe(zip('extension.zip'))
  .pipe(gulp.dest('.'));
});
