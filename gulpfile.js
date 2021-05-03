const { series, parallel, src, dest, watch } = require('gulp');
const { pipeline } = require('stream')
const rename = require("gulp-rename")
const uglify = require('gulp-uglify-es').default
const sourcemaps = require('gulp-sourcemaps')
const htmlmin = require('gulp-htmlmin')
const sass = require('gulp-sass')
const http = require('http')
const st = require('st')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const replace = require('gulp-replace')
sass.compiler = require('node-sass')

const indexFile = 'index.html'
const port = 3000
const htmlVars = {
    linkCss: 'styles.css'
}

function _replaceHtml(match, p1, offset, string) {
    return htmlVars[p1]
}

function _beforeAll(env) {
    
    _envSwitch(env, () => {
        htmlVars.scriptApp = 'app.min.js'
        htmlVars.scriptLibs = 'libs.min.js'
    }, () => {
        htmlVars.scriptApp = 'app.js'
        htmlVars.scriptLibs = 'libs.js'
    })

    return function beforeAll(cb) {
        return pipeline(
            src('*.html'),
            replace(/{{(.+)}}/gm, _replaceHtml),
            htmlmin({ collapseWhitespace: true }),
            rename(indexFile),
            dest('build')
        )
    }
}

function beforeJs(cb) {
    cb()
}

function minifyCss(cb) {
    return pipeline(
        src(['css/*.scss']),
        sourcemaps.init(),
        sass().on('error', sass.logError),
        sourcemaps.write(),
        dest('build/css')
    )
}

function watcher(cb) {
    watch([
        'css/**/*',
        'js/**/*',
        'images/**/*',
        indexFile,
        '*.js',
        '*.json'
    ], globals['dev-build']).on('change', (evt) => {
        console.log('Rebuilding...')
    })
}

function _envSwitch(env, prod, dev)
{
    switch (env)
    {
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
    let react = 'node_modules/react/umd/react.development.js'
    let reactDom = 'node_modules/react-dom/umd/react-dom.development.js'

    _envSwitch(env, () => {
        react = 'node_modules/react/umd/react.production.min.js'
        reactDom = 'node_modules/react-dom/umd/react-dom.production.min.js'
    })

    return function copyLibs() {
        return pipeline(
            src([
                react,
                reactDom
            ], { nosort: true }),
            sourcemaps.init(),
            concat(htmlVars.scriptLibs),
            sourcemaps.write(),
            dest('build/js/')
        )
    }
} 

function _minifyJs(env) {
    return function minifyJs(cb) {
        return pipeline(
            src([
                'js/**/*.js',
                'js/**/*.jsx'
            ], { nosort: false }),
            sourcemaps.init(),
            concat(htmlVars.scriptApp),
            babel({
                presets: [
                    '@babel/preset-env',
                    '@babel/preset-react'
                ]
            }),
            uglify(),
            sourcemaps.write(),
            dest('build/js/')
        )
    }
}

function afterAll(cb) {
    cb()
}

function server(cb) {
    http.createServer(
        st({ path: __dirname + '/build', index: indexFile, cache: false})
    ).listen(port, () => {
        console.log(`Listening on port ${port}`)
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
            minifyCss
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

let globals = {
    build: build('prod'),
    'dev-build': build('dev'),
    'dev-run': devRun()
}

module.exports = exports = globals