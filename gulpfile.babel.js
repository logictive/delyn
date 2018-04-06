import gulp from 'gulp';
//import debug from 'gulp-debug';
//import log from 'fancy-log';
import {spawn} from 'child_process';
import hugoBin from 'hugo-bin';
import gutil from 'gulp-util';
import flatten from 'gulp-flatten';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import cssNano from 'gulp-cssnano';
import rename from 'gulp-rename';
import cssImport from 'postcss-import';
import nested from 'postcss-nested';
import cssNext from 'postcss-cssnext';
import BrowserSync from 'browser-sync';
import imageresize from 'gulp-image-resize';
import imagemin from 'gulp-imagemin';
import imageminMozJpeg from 'imagemin-mozjpeg';
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
gulp.task('build', ['css', 'js', 'fonts', 'images'], (cb) => buildSite(cb, [], 'production'));
gulp.task('build-preview', ['css', 'js', 'fonts', 'images'], (cb) => buildSite(cb, hugoArgsPreview, 'production'));

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

var sizes = [
  {name: 'tmb', width: 30, crop: false, quality: 20},
  {name: 'sm', width: 640, crop: false, quality: 80},
  {name: 'md', width: 1024, crop: false, quality: 90},
  {name: 'lg', width: 1280, crop: false, quality: 90},
  {name: '', width: 2024, crop: false, quality: 90}
];
gulp.task('images', () => {
  sizes.forEach((size) => {
    var resize_settings = {
      width: size.width,
      crop: size.crop,
      upscale : false
    };
    if (size.hasOwnProperty('height')) {
      resize_settings.height = size.height;
    }

    gulp.src('./src/img/**/*.{jpg,png}', {base: './src/img/'})
      .pipe(imageresize(resize_settings))
      .pipe(imagemin({
        plugins: [
          imageminMozJpeg({
            progressive: true,
            quality: size.quality
          })
        ]
      }))
      .pipe(rename((path) => {
        path.basename = size.name ? path.basename + '-' + size.name : path.basename;
      }))
      .pipe(gulp.dest('./dist/img/'));
  });

  gulp.src('./src/img/**/*.svg', {base: './src/img/'})
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest('./dist/img/'));
});

// Development server with browsersync
gulp.task('server', ['hugo', 'css', 'js', 'fonts', 'images'], () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/css/**/*.css', ['css']);
  gulp.watch('./src/fonts/**/*', ['fonts']);
  gulp.watch('./src/images/**/*', ['images']);
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
