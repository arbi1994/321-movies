const { src, dest, watch, series, tree } = require('gulp')
// js modules
const minifyJs = require('gulp-uglify')
const sourceMaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
// sass modules 
const sass = require('gulp-sass')(require('sass'))
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const browsersync = require('browser-sync').create()
const htmlmin = require('gulp-htmlmin')

const mainJsFiles = [
    './node_modules/animejs/lib/anime.min.js',
    './public/js/mainPage/main.js',
    './public/js/mainPage/navbar.js',
    './public/js/mainPage/burgerMenu.js',
    './public/js/mainPage/infiniteScrolling.js',
    './public/js/mainPage/enableDisableScroll.js',
    './public/js/mainPage/buttonsSlider.js',
    './public/js/mainPage/moviesByGenre.js',
    './public/js/mainPage/search.js',
    './public/js/mainPage/carousel.js',
]

const infoJsFiles = [
    './public/js/infoPage/info.js',
    './public/js/infoPage/pageTitle.js',
    './public/js/infoPage/trailer.js',
    './public/js/infoPage/watchBuyProviders.js',
]

const htmlFiles = [
    './index.html',
    './about.html',
    './info.html',
]

// JS tasks
const bundleMainJs = () => {
    return src(mainJsFiles)
        .pipe(sourceMaps.init())
        .pipe(minifyJs())
        .pipe(concat('bundle.js'))
        .pipe(sourceMaps.write())
        .pipe((dest('./dist/js/main')))
}

const bundleInfoJs = () => {
    return src(infoJsFiles)
        .pipe(sourceMaps.init())
        .pipe(minifyJs())
        .pipe(concat('bundle.js'))
        .pipe(sourceMaps.write())
        .pipe((dest('./dist/js/info')))
}

// SASS tasks
const scssTask = () => {
    return src('./public/sass/main.scss', { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('./dist/sass', { sourcemaps: true }))
}

//HTML tasks
const htmlTaks = () => {
    return src(htmlFiles)
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(dest('./dist',));
}

// Browsersync
const browserSyncServe = (cb) => {
    browsersync.init({
        server: {
            baseDir: './'
        },
        notify: {
            styles: {
                top: 'auto',
                bottom: '0'
            }
        }
    })
    cb()
}

const browsersyncReload = (cb) => {
    browsersync.reload()
    cb()
}

// Watch tasks
const devWatch = () => {
    watch('*.html', browsersyncReload)
    watch(
        ['./public/sass/**/*.scss', './public/js/**/*.js'],
        series(scssTask, bundleMainJs, bundleInfoJs, browsersyncReload)
    )
}

exports.watch = series(
    htmlTaks,
    scssTask,
    bundleMainJs,
    bundleInfoJs,
    browserSyncServe,
    devWatch
)

// Run all tasks all together with default property
exports.build = series(
    htmlTaks,
    scssTask,
    bundleMainJs,
    bundleInfoJs,
)

