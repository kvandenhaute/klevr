const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const color = require('ansi-colors');
const config = require('config');
const noop = require('through2').obj;

const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const stylelint = require('gulp-stylelint');
const template = require('gulp-template');

let server = { active: false };

gulp.task('iconfont', () => {
	const timestamp = Math.round(Date.now() / 1000);

	return gulp.src('assets/icons/*.svg')
		.pipe(startPlumber())
		.pipe(iconfont({
			fontName: 'icons',
			normalize: true,
			fontHeight: 1001,
			formats: ['woff2', 'woff'],
			timestamp
		}))
		.on('glyphs', (glyphs) => {
			glyphs.forEach(function (glyph) {
				glyph.codepoint = glyph.unicode[ 0 ].charCodeAt(0).toString(16).toUpperCase();
			});

			gulp.src('./build/icons.scss.tpl')
				.pipe(template({
					glyphs: glyphs,
					fontName: 'icons',
					prefix: 'icon'
				}))
				.pipe(rename('_icons.scss'))
				.pipe(gulp.dest('assets/style/fonts'));
		})
		.pipe(gulp.dest('web/fonts'))
		.pipe(stopPlumber());
});

gulp.task('images', () => {
	return gulp.src('assets/img/**/*')
		.pipe(gulp.dest('web/img'));
})

gulp.task('stylesheets:build', () => {
	const plugins = [autoprefixer()];

	return gulp.src('assets/style/*.scss')
		.pipe(sass())
		.pipe(postcss(plugins))
		.pipe(gulp.dest('web/css'))
		.pipe(server.active ? server.stream() : noop());
});

gulp.task('stylesheets:lint', () => {
	return gulp.src('assets/style/**/*.scss')
		.pipe(stylelint({
			reporters: [
				{ formatter: 'string', console: true }
			],
			failAfterError: false
		}));
});

gulp.task('stylesheets:update', gulp.parallel('stylesheets:build', 'stylesheets:lint'));
gulp.task('stylesheets', gulp.series('iconfont', 'stylesheets:build'));

gulp.task('server:create', done => {
	server = browserSync.create();

	done();
});

gulp.task('server:reload', done => {
	if (server.active) {
		server.reload();
	}

	done();
});

gulp.task('server', gulp.series('server:create', () => {
	server.init({
		server: {
			baseDir: './web'
		},
		open: false,
		ghostMode: false,
		notify: true
	});

	gulp.watch('assets/img/**/*', gulp.series('images', 'server:reload'));
	gulp.watch('assets/style/**/*.scss', gulp.series('stylesheets:update'));
	gulp.watch('web/**/*.html', gulp.series('server:reload'));
}));

gulp.task('default', gulp.series(gulp.parallel('images', 'stylesheets'), 'server'));

function displayError(err) {
	let message;

	message = '';
	message += '\n\n\t';
	message += color.bold(color.red('Error ocurred: '));
	message += '\n\t';
	message += color.white(err.message);

	if (typeof err.fileName !== 'undefined') {
		message += '\n\t';
		message += '=> ' + err.fileName;

		if (typeof err.lineNumber !== 'undefined') {
			message += ':' + err.lineNumber;
		}
	}

	message += '\n\n';
	message += err.stack;

	log.error(message);
	// beep();
	this.emit('end');
}

function startPlumber() {
	if (config.get('breakOnError')) {
		return noop();
	}

	return plumber({
		'errorHandler': displayError
	});
}

function stopPlumber() {
	if (config.get('breakOnError')) {
		return noop();
	}

	return plumber.stop();
}
