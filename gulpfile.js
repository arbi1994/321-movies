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

const mainJsFiles = [
'./node_modules/animejs/lib/anime.min.js',
'./js/mainPage/main.js',
'./js/mainPage/navbar.js',
'./js/mainPage/burgerMenu.js',
'./js/mainPage/infiniteScrolling.js',
'./js/mainPage/enableDisableScroll.js',
'./js/mainPage/buttonsSlider.js',
'./js/mainPage/moviesByGenre.js',
'./js/mainPage/search.js',
'./js/mainPage/carousel.js']

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
    return src('./js/infoPage/info.js')
    .pipe(sourceMaps.init())
    .pipe(minifyJs())
    .pipe(concat('bundle.js'))
    .pipe(sourceMaps.write())
    .pipe((dest('./dist/js/info')))
}

// SASS tasks
const scssTask = () => {
    return src('./sass/main.scss', { sourcemaps: true })
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('./dist/sass', { sourcemaps: true }))
}

// Browsersync
const browserSyncServe = (cb) => {
    browsersync.init({
        server: {
            baseDir: './',
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
        ['./sass/**/*.scss', './js/**/*.js'],
        series(scssTask, bundleMainJs, bundleInfoJs, browsersyncReload)
    )
}

// Run all tasks all together with default property
exports.default = series(
    scssTask,
    bundleMainJs,
    bundleInfoJs,
    browserSyncServe,
    devWatch
)

