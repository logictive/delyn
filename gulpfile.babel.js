import gulp from 'gulp';
import {spawn} from 'child_process';
import hugoBin from 'hugo-bin';
import gutil from 'gulp-util';
import flatten from 'gulp-flatten';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import cssNano from 'gulp-cssnano';
import cssImport from 'postcss-import';
import nested from 'postcss-nested';
import cssNext from 'postcss-cssnext';
import BrowserSync from 'browser-sync';
import webpack from 'webpack';
import webpackConfig from './webpack.conf';

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ['-d', '../dist', '-s', 'site', '-v'];
const hugoArgsPreview = ['--buildDrafts', '--buildFuture'];

// Development tasks
gulp.task('hugo', (cb) => buildSite(cb));
gulp.task('hugo-preview', (cb) => buildSite(cb, hugoArgsPreview));

// Build/production tasks
gulp.task('build', ['css', 'js', 'fonts'], (cb) => buildSite(cb, [], 'production'));
gulp.task('build-preview', ['css', 'js', 'fonts'], (cb) => buildSite(cb, hugoArgsPreview, 'production'));

// Compile CSS with PostCSS
gulp.task('css', () => {
  const processors = [
    cssImport({from: './src/css/main.css'}),
    nested(),
    cssNext()
  ];


  gulp.src('./src/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(cssNano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

// Compile Javascript
gulp.task('js', (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      colors: true,
      progress: true
    }));
    browserSync.reload();
    cb();
  });
});

// Move all fonts in a flattened directory
gulp.task('fonts', () => (
  gulp.src('./src/fonts/**/*')
    .pipe(flatten())
    .pipe(gulp.dest('./dist/fonts'))
    .pipe(browserSync.stream())
));

var images = [
  {size: 'tmb', width: 30, crop: false},
  {size: 'sm', width: 640, crop: false},
  {size: 'md', width: 1024, crop: false},
  {size: 'lg', width: 1280, crop: false}
];

gulp.task('images', () => {
  images.forEach((type) => {
    var resize_settings = {
      width: type.width,
      crop: type.crop,
      // never increase image dimensions
      upscale : false
    };
    if (type.hasOwnProperty('height')) {
      resize_settings.height = type.height;
    }

    gulp.src('./src/img/**/*.{jpg,png,gif}');
  });
  //https://gist.github.com/ryantbrown/239dfdad465ce4932c81

  gulp.src('./src/img/**/*.{svg}');

});

// Development server with browsersync
gulp.task('server', ['hugo', 'css', 'js', 'fonts'], () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/css/**/*.css', ['css']);
  gulp.watch('./src/fonts/**/*', ['fonts']);
  gulp.watch('./site/**/*', ['hugo']);
});

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = 'development') {
  const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

  process.env.NODE_ENV = environment;

  return spawn(hugoBin, args, {stdio: 'inherit'}).on('close', (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify('Hugo build failed :(');
      cb('Hugo build failed');
    }
  });
}
