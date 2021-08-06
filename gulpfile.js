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
const notify = require('gulp-notify')
const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache')

const mainJsFiles = [
    'node_modules/animejs/lib/anime.min.js',
    'public/js/mainPage/main.js',
    'public/js/mainPage/navbar.js',
    'public/js/mainPage/burgerMenu.js',
    'public/js/mainPage/infiniteScrolling.js',
    'public/js/mainPage/enableDisableScroll.js',
    'public/js/mainPage/buttonsSlider.js',
    'public/js/mainPage/moviesByGenre.js',
    'public/js/mainPage/search.js',
    'public/js/mainPage/carousel.js',
]

const infoJsFiles = [
    'public/js/infoPage/info.js',
    'public/js/infoPage/pageTitle.js',
    'public/js/infoPage/trailer.js',
    'public/js/infoPage/watchBuyProviders.js',
]

const htmlFiles = [
    'public/index.html',
    'public/about.html',
    'public/info.html',
]

// JS tasks
const bundleMainJs = () => {
    return src(mainJsFiles)
        .pipe(sourceMaps.init())
        .pipe(minifyJs())
        .pipe(concat('mainBundle.js'))
        .pipe(sourceMaps.write())
        .pipe((dest('dist')))
        .pipe( notify( { message: 'jsMain task complete.' } ) )

}

const bundleInfoJs = () => {
    return src(infoJsFiles)
        .pipe(sourceMaps.init())
        .pipe(minifyJs())
        .pipe(concat('infoBundle.js'))
        .pipe(sourceMaps.write())
        .pipe((dest('dist')))
        .pipe( notify( { message: 'jsInfo task complete.' } ) )
}

// SASS tasks
const scssTask = () => {
    return src('public/sass/main.scss')
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest('dist'))
        .pipe( notify( { message: 'CSS task complete.' } ) )
}

//HTML tasks
const htmlTaks = () => {
    return src(htmlFiles)
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(dest('dist'))
        .pipe( notify( { message: 'HTML task complete.' } ) )
}

// Images
const images = async () => {
    return src('public/images/**/*.svg')
        .pipe( cache( imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }) ))
        .pipe( dest('dist') )
        .pipe( notify( { message: 'Images task complete.' } ) )
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
        ['public/sass/**/*.scss', './public/js/**/*.js'],
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
    images,
    htmlTaks,
    scssTask,
    bundleMainJs,
    bundleInfoJs,
)

