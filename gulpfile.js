const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('images', () => {
	return gulp.src('assets/img/**/*')
		.pipe(gulp.dest('web/img'));
})

gulp.task('stylesheets', () => {
	return gulp.src('assets/style/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('web/css'))
		.pipe(browserSync.stream());
});

gulp.task('server:reload', done => {
	browserSync.reload();
	done();
});

gulp.task('server', () => {
	browserSync.init({
		server: {
			baseDir: './web'
		},
		open: false,
		ghostMode: false,
		notify: true
	});

	gulp.watch('assets/img/**/*', gulp.series('images', 'server:reload'));
	gulp.watch('assets/style/**/*.scss', gulp.series('stylesheets'));
	gulp.watch('web/**/*.html', gulp.series('server:reload'));
});

gulp.task('serve', gulp.series(gulp.parallel('images', 'stylesheets'), 'server'));
gulp.task('default', gulp.parallel('serve'));
