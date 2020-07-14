const gulp = require("gulp");

const plumber = require("gulp-plumber");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const server = require("browser-sync").create();
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const del = require("del");
const cssBase64 = require("gulp-css-base64");

const path = {
  dist: './build/',
  base: 'source',
  build: {
    html: 'build/',
    css: 'build/css/',
    img: 'source/img/',
  },
  src: {
    html: 'source/*.html',
    css: 'source/sass/style.scss',
    base64: 'build/css/style.min.css',
    img: 'source/img/*.{png,jpg,svg}',
    webp: 'source/img/*.{png,jpg}',
    copyIco: 'source//*.ico',
    copyImg: 'source/img/*.*',
  },
  watch: {
    html: 'source/*.html',
    css: 'source/sass/**/*.{scss,sass}',
  }
};

function css() {
  return gulp.src(path.src.css)
    .pipe(plumber())
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    }))
    .pipe(postcss([autoprefixer({
      browsers: [
        "> 1%",
        "not dead"
      ]
    })]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest(path.build.css))
    .pipe(server.stream());
}

function refresh() {
  server.reload();
}

function serve() {
  server.init({
    server: path.dist,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  gulp.watch(path.watch.css, gulp.series(css, base64)).on('change', refresh);
  gulp.watch(path.watch.html, gulp.series(html)).on('change', refresh);
  gulp.watch(path.src.img, gulp.series(copyImg)).on('change', refresh);
}

function images() {
  return gulp.src(path.src.img)
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.svgo({
        plugins: [{
            cleanupIDs: false
          },
          {
            removeViewBox: false
          },
          {
            convertPathData: false
          },
          {
            mergePaths: false
          },
        ],
      })
    ]))
    .pipe(gulp.dest(path.build.img));
}

function webpImg() {
  return gulp.src(path.src.webp)
    .pipe(webp({
      quality: 90
    }))
    .pipe(gulp.dest(path.build.img));
}

function base64() {
  return gulp.src(path.src.base64)
    .pipe(cssBase64({
      maxWeightResource: 5000, //50кб
      extensionsAllowed: [".png", ".jpg"]
    }))
    .pipe(gulp.dest(path.build.css));
}

function html() {
  return gulp.src(path.src.html)
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest(path.build.html));
}

function copy() {
  return gulp.src([
      path.src.copyImg,
      path.src.copyIco,
    ], {
      base: path.base
    })
    .pipe(gulp.dest(path.dist));
}

function copyImg() {
  return gulp.src([
      path.src.copyImg,
    ], {
      base: path.base
    })
    .pipe(gulp.dest(path.dist));
}


function clean() {
  return del(path.dist);
}

const build = gulp.series(clean, copy, css, base64, html);
let prod = gulp.series(clean, webpImg, images, copy, css, base64, html);

module.exports.build = build;
module.exports.start = gulp.series(build, serve);
module.exports.prod = prod;
module.exports.img = gulp.series(webpImg, images, copy);
