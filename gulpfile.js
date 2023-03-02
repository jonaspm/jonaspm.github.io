const { series, parallel, src, dest, watch } = require('gulp')
const { pipeline } = require('stream')
const rename = require("gulp-rename")
const uglify = require('gulp-uglify-es').default
const htmlmin = require('gulp-htmlmin')
const sass = require('gulp-sass')(require('sass'))
const http = require('http')
const st = require('st')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const replace = require('gulp-replace')
const livereload = require('gulp-livereload')

const INDEX_FILE = 'index.html'
const PORT = 3000
const BUILD_FOLDER = 'build'
const SOURCE_FOLDER = 'src'
const SOURCE_PATH = process.cwd() + '/' + SOURCE_FOLDER
const htmlVars = {
    linkCss: 'styles.css'
}

function _replaceHtml(match, p1, offset, string) {
    return htmlVars[p1]
}

function _beforeAll(env) {

    _envSwitch(env, () => {
        // PROD
        htmlVars.scriptApp = 'app.min.js'
        htmlVars.scriptLibs = 'libs.min.js'
    }, () => {
        // DEV
        htmlVars.scriptApp = 'app.js'
        htmlVars.scriptLibs = 'libs.js'
    })

    return function beforeAll(cb) {
        return pipeline(
            src('*.{html,htm}', { cwd: SOURCE_PATH }),
            replace(/{{(.+)}}/gm, _replaceHtml),
            htmlmin({ collapseWhitespace: true }),
            rename(INDEX_FILE),
            dest(BUILD_FOLDER + '/'),
            (err) => {
                if (err) {
                    console.error('Pipeline failed.', err);
                }
            }
        )
    }
}

function beforeJs(cb) {
    cb()
}

function minifyCss(cb) {
    return pipeline(
        src(['css/**/*.{scss,css}'], { cwd: SOURCE_PATH, sourcemaps: true }),
        concat(htmlVars.linkCss),
        sass().on('error', sass.logError),
        dest(BUILD_FOLDER + '/css', { sourcemaps: true }),
        (err) => {
            if (err) {
                console.error('Pipeline failed.', err);
            }
        }
    )
}

function images(cb) {
    return pipeline(
        src(['images/**/*.*'], { cwd: SOURCE_PATH, sourcemaps: true }),
        dest(BUILD_FOLDER + '/images', { sourcemaps: true }),
        (err) => {
            if (err) {
                console.error('Pipeline failed.', err);
            }
        }
    )
}

function watcher(cb) {
    livereload.listen({ basePath: BUILD_FOLDER, start: true })
    watch([
        'css/**/*',
        'js/**/*',
        'images/**/*',
        INDEX_FILE,
        '*.js',
        '*.json'
    ], {
        cwd: SOURCE_PATH
    }, globals['build-dev']).on('change', (path, stats) => {
        console.log('Rebuilding...')
    })
}

function _envSwitch(env, prod, dev) {
    switch (env) {
        case 'prod': {
            if (prod) prod()
            break;
        }
        default: {
            if (dev) dev()
        }
    }
}

function _copyLibs(env) {
    // DEV
    let react = 'node_modules/react/umd/react.development.js'
    let reactDom = 'node_modules/react-dom/umd/react-dom.development.js'

    _envSwitch(env, () => {
        // PROD
        react = 'node_modules/react/umd/react.production.min.js'
        reactDom = 'node_modules/react-dom/umd/react-dom.production.min.js'
    })

    return function copyLibs() {
        return pipeline(
            src([
                react,
                reactDom
            ], { nosort: true, sourcemaps: true }),
            concat(htmlVars.scriptLibs),
            dest(BUILD_FOLDER + '/js', { sourcemaps: true }),
            (err) => {
                if (err) {
                    console.error('Pipeline failed.', err);
                }
            }
        )
    }
}

function _minifyJs(env) {
    return function minifyJs(cb) {
        return pipeline(
            src([
                'js/**/*.{js,jsx}',
            ], { nosort: false, cwd: SOURCE_PATH, sourcemaps: true }),
            concat(htmlVars.scriptApp),
            babel({
                presets: [
                    '@babel/preset-env',
                    '@babel/preset-react'
                ],
                plugins: [
                    'macros'
                ]
            }),
            uglify(),
            dest(BUILD_FOLDER + '/js', { sourcemaps: true }),
            (err) => {
                if (err) {
                    console.error('Pipeline failed.', err);
                }
            }
        )
    }
}

function afterAll(cb) {
    return pipeline(
        src(BUILD_FOLDER + '/' + INDEX_FILE),
        livereload(),
        (err) => {
            if (err) {
                console.error('Pipeline failed.', err);
            }
        }
    )
}

function server(cb) {
    http.createServer(
        st({ path: __dirname + '/' + BUILD_FOLDER, index: INDEX_FILE, cache: false })
    ).listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
        cb()
    })
}

/**
 * END OF INTERNAL TASK DEFINITIONS
 */

function build(env) {
    return series(
        _beforeAll(env),
        parallel(
            _copyLibs(env),
            series(beforeJs, _minifyJs(env)),
            minifyCss,
            images
        ),
        afterAll
    )
}

function devRun() {
    return parallel(
        build('dev'),
        server,
        watcher
    )
}

const globals = {
    'build': build('prod'),
    'build-dev': build('dev'),
    'run-dev': devRun()
}

module.exports = exports = globals