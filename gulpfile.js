const { series, parallel, src, dest } = require('gulp');
const { pipeline } = require('stream');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');

function beforeAll(cb) {
    return pipeline(
        src('*.html'),
        htmlmin({ collapseWhitespace: true }),
        rename('index.html'),
        dest('build')
    );
}

function beforeJs(cb) {
    cb();
}

function minifyCss(cb) {
    cb();
}

function livereload(cb) {
    cb();
}

function minifyJs(cb) {
    return pipeline(
        src([
            'js/*.js',
            'node_modules/react/cjs/react.production.min.js'
        ]),
        rename('bundle.min.js'),
        sourcemaps.init(),
        uglify(),
        sourcemaps.write(),
        dest('build/js/'),
    );
}

function afterAll(cb) {
    cb();
}


exports.build = series(
    beforeAll,
    parallel(
        series(beforeJs, minifyJs),
        minifyCss
    ),
    afterAll
);

exports.dev = series(
    beforeAll,
    parallel(
        series(beforeJs, minifyJs),
        minifyCss
    ),
    afterAll,
    livereload
);