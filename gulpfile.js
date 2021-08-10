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
    './node_modules/animejs/lib/anime.min.js',
    './src/js/mainPage/main.js',
    './src/js/mainPage/navbar.js',
    './src/js/mainPage/burgerMenu.js',
    './src/js/mainPage/infiniteScrolling.js',
    './src/js/mainPage/enableDisableScroll.js',
    './src/js/mainPage/buttonsSlider.js',
    './src/js/mainPage/moviesByGenre.js',
    './src/js/mainPage/search.js',
    './src/js/mainPage/carousel.js',
]

const infoJsFiles = [
    './src/js/infoPage/info.js',
    './src/js/infoPage/pageTitle.js',
    './src/js/infoPage/trailer.js',
    './src/js/infoPage/watchBuyProviders.js',
]

const htmlFiles = [
    './src/index.html',
    './src/about.html',
    './src/info.html',
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
    return src('./src/sass/main.scss')
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
    return src('./src/images/**/*.svg')
        .pipe( cache( imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }) ))
        .pipe( dest('dist') )
        .pipe( notify( { message: 'Images task complete.' } ) )
}

// Browsersync
const browserSyncServe = (cb) => {
    browsersync.init({
        server: {
            baseDir: './',
            index: './dist/index.html',
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
    images,
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

