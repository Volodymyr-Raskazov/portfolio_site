'use strict';

const gulp = require('gulp'), { watch, series } = require('gulp');
// const reset = { deleteAsync } = require('del');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
// const sourcemaps = require('gulp-sourcemaps');
const autoPrefixer = require('gulp-autoprefixer');
const groupCssMediaQueries = require('gulp-group-css-media-queries');
// const webpCss = require('gulp-webpcss');
const csso = require('gulp-csso');
// const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const fileInclude = require('gulp-file-include');

function buildHtml(cb) {
	return gulp.src('./html/index.html')
		.pipe(fileInclude())
		.pipe(gulp.dest('./'))
		.pipe(browserSync.stream())
	cb();
}

function buildStyles(cb) {
	return gulp.src('./scss/style.scss')
		// .pipe(reset('./assets/css/*.css'))
		// .pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoPrefixer({
			grid: true,
			overrideBrowserslist: ["last 4 versions"],
			cascade: true
		}))
		.pipe(groupCssMediaQueries())
		// .pipe(webpCss({
		// 	webpClass: '.webp',
		// 	noWebpClass: '.no-webp'
		// }))
		// .pipe(sourcemaps.write())
		.pipe(gulp.dest('./css'))
		// .pipe(cleanCss())
		.pipe(csso())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('./css'))
		.pipe(browserSync.stream())
	cb();
};

function liveServer(cb) {
	browserSync.init({
		server: {
			baseDir: './'
		},
		notify: false,
		host: 'localhost',
		port: 3000,
	})
	cb();
};

function watcher() {
	gulp.watch('./html/**/*.html', buildHtml);
	gulp.watch('./scss/**/*.scss', buildStyles);
	gulp.watch('./js/**/*.js').on('change', browserSync.reload);
	gulp.watch('./*.html').on('change', browserSync.reload);
};

exports.buildHtml = buildHtml;
exports.buildStyles = buildStyles;
exports.liveServer = liveServer;
exports.watcher = watcher;

const mainTasks = gulp.series(liveServer, watcher);

exports.mainTasks = mainTasks;

gulp.task('default', mainTasks);
