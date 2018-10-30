const gulp = require('gulp'),
	  handlebars = require('gulp-compile-handlebars'),
	  minifyHTML = require('gulp-htmlmin'),
	  sass = require('gulp-sass'),
	  csso = require('gulp-csso'),
	  uglify = require('gulp-uglify'),
	  imagemin = require('gulp-imagemin'),
	  del = require('del'),
	  rename = require('gulp-rename'),
	  gulpif = require('gulp-if'),
	  runSequence = require('run-sequence'),
	  server = require('gulp-live-server'),
	  exec = require('child_process').execSync;

// Set minify to false in-order to create a sanitized version of output
var minify = false;

// Paths and globs to different files that we require
var paths = {
	database: './app/assets/data/database.json',
	indexFile: './app/index.hbs',
	SassCode: './app/assets/sass/*.scss',
	JavaScriptCode: './app/assets/js/**/**',
	imagesPath: './app/assets/img/**/**'
}

// Read the config file where our data is present
var JSONdata = require(paths.database);

// Options for Minifing HTML, we use HTML min
var minifyJSOptions = {
	collapseWhitespace: true,
	collapseBooleanAttributes: true,
	collapseInlineTagWhitespace: true,
	conservativeCollapse: true,
	minifyCSS: true,
	minifyJS: true,
	minifyURLs: true,
	removeEmptyAttributes: true,
	removeEmptyElements: true,
	removeComments: true,
	removeScriptTypeAttributes: true
}

// Options for image optimization using imagemin
var minifyIMGOptions = {
	interlaced: true,
	progressive: true,
	optimizationLevel: 5,
	verbose: true
}

// Options for development server
var serverConfig = {
	PORT: 4037
}

// Setting the SASS compiler of gulp-sass to node-sass compiler
sass.compiler = require('node-sass');

// Gulp Task for compiling Handlebars into HTML
gulp.task('compile-handlebars', function() {
	return gulp.src(paths.indexFile)
		.pipe(handlebars(JSONdata, {
			helpers: {
				capitals : function(str){
					return str.toUpperCase();
				}
			}
		}))
		.pipe(gulpif(minify, minifyHTML(minifyJSOptions)))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('./dist'));
});

// Gulp Task for compiling SASS into CSS
gulp.task('compile-sass', function() {
	return gulp.src(paths.SassCode)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulpif(minify, csso()))
		.pipe(gulp.dest('./dist/assets/css'));
});

// Gulp Task for compiling JavaScript
gulp.task('compile-javascript', function() {
	return gulp.src(paths.JavaScriptCode)
		.pipe(gulpif(minify, uglify()))
		.pipe(gulp.dest('./dist/assets/js'));
});

// Gulp Task for optimizing images
gulp.task('optimize-images', function() {
	return gulp.src(paths.imagesPath)
		.pipe(gulpif(minify, imagemin(minifyIMGOptions)))
		.pipe(gulp.dest('./dist/assets/img'));
});

// The Gulp Task for building the site. It only builds, doesn't clean or watch for file changes
gulp.task('build', function() {
	minify = true;
	return runSequence(['compile-handlebars', 'compile-sass', 'compile-javascript', 'optimize-images']);
});

// Gulp Task for cleaning the output directory
gulp.task('clean', () => del.sync(['dist']));

// The default gulp task
gulp.task('default', function() {
	// Doing a fresh build, by deleting the output folder and building everything from sources
	runSequence('clean', ['compile-handlebars', 'compile-sass', 'compile-javascript', 'optimize-images'], function(callback){
		console.log("[INFO]: Initial Build Finished");
		console.log("[INFO]: Gulp is now watching for any new changes");
	});

	// Watch and rebuild Handlebars if any changes are detected
	gulp.watch(paths.indexFile, ['compile-handlebars']);

	// Watch and rebuild SASS if any changes are detected
	gulp.watch('./app/assets/sass/**/**', ['compile-sass']);

	// Watch and rebuild JavaScript if any changes are detected
	gulp.watch(paths.JavaScriptCode, ['compile-javascript']);

	// Watch and optimize images if any chnges are detected
	gulp.watch(paths.imagesPath, ['optimize-images']);

	// Start the development server
	var staticServer = server.static('./dist', serverConfig.PORT);
	staticServer.start();
});