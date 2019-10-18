const fr = require('fs').readFileSync,
      gulp = require('gulp'),
      pug = require('gulp-pug'),
      sass = require('gulp-sass'),
      server = require('browser-sync'),
      yml = require('js-yaml').safeLoad,
      cfile = 'config.yml',
      print = console.log,
      char = 'utf8';

let conf = yml(fr(cfile, char));
let helpTask,
    testTask,
    buildHtml,
    buildCss,
    copySass,
    copyJs,
		startServer;

sass.compiler = require('node-sass');

helpTask = (cb) => {
  print('Tasks');
  print('-----');
  print('gulp');
  print('gulp test');
  print('gulp start');
  print('gulp build');
  cb();
};

testTask = (cb) => {
  print(conf);
  cb();
};

buildHtml = (cb) => {
  gulp.src(conf.pug.srcfiles)
    .pipe(pug(conf.pug.options))
    .pipe(gulp.dest(conf.pug.output.path));
  cb();
};

buildCss = (cb) => {
  gulp.src(conf.sass.srcfiles)
    .pipe(sass(conf.sass.options)
			.on('error', sass.logError))
    .pipe(gulp.dest(conf.sass.output.path));
  cb();
};

copySass = (cb) => {
  gulp.src(conf.sass.all)
    .pipe(gulp.dest(conf.sass.output.copy));
  cb();
};

copyJs = (cb) => {
	gulp.src(conf.js.all)
    .pipe(gulp.dest(conf.js.output.copy));
  cb();
};

startServer = (cb) => {
	server.init(conf.localhost.options);
	gulp.watch(conf.localhost.reload.html)
		.on('change', server.reload);
	gulp.watch(conf.localhost.reload.css)
		.on('change', server.reload);
	gulp.watch(conf.localhost.reload.js)
		.on('change', server.reload);
};

exports.default = helpTask;
exports.test = testTask;
exports.start = gulp.series(
	buildHtml, buildCss,
	copySass, copyJs,
	startServer
);
exports.build = gulp.series(
	buildHtml, buildCss,
	copySass, copyJs
);
