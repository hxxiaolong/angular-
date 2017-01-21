var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    network = require('network'),
    clean = require('gulp-clean'),
    RevAll = require('gulp-rev-all');
    runSequence = require('run-sequence'),
    concat = require('gulp-concat'),
    gpngquant = require('imagemin-pngquant');


var proxyMiddleware = require('http-proxy-middleware');
var proxy = proxyMiddleware('/healthstore', {
    target: 'http://test.hmsgtech.com:8080'
});

var $ = require('gulp-load-plugins')();

// web server
gulp.task('server', function () {
    browserSync.init({
        port: 9001,
        host: network.get_private_ip(function (err, ip) {
            return (err || ip);
        }),
        ghostMode: {
            clicks: false,
            location: false,
            forms: false,
            scroll: false
        },
        startPath: 'index.html',
        open: 'Local',
        server: {
            baseDir: './',
            directory: true
        },
        middleware: [proxy]
    });
    gulp.watch('./stylesheet/**/*', ['css']);
    gulp.watch('./**/*.html').on('change', reload);
    gulp.watch('./js/**/*.js').on('change', function (event) {
        return gulp.src(event.path)
            .pipe($.plumber({
                errorHandler: function (err) {
                    console.log(err);
                    this.emit('end');
                }
            }))
            .pipe(browserSync.stream());
    });
    gulp.watch('./img/**/*.{jpg,jpeg,png,gif,svg,ico}').on('change', reload);
    gulp.watch('./fonts/**/*.{eot,svg,ttf,woff,woff2}').on('change', reload);
});

// compile sass
gulp.task('css', function () {
    return gulp.src('./stylesheet/**/*.scss')
        .pipe($.plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe($.sourcemaps.init())
        .pipe($.sass())
        .pipe($.autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0', 'iOS 7'],
            cascade: true
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./css'))
        .pipe($.plumber.stop())
        .pipe(browserSync.stream());
});

// Images
gulp.task('images', function() {
    return gulp.src(['./images/*.{jpg,jpeg,png,gif,svg,ico}'])
        .pipe($.cache($.imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [gpngquant()]
        })))
        .pipe(gulp.dest('./.tmp/images'));
});


// revall
gulp.task('rev', function () {
    gulp.src('./.tmp/**')
        .pipe(RevAll.revision())
        .pipe(gulp.dest('./web'))
        .pipe(RevAll.manifestFile())
        .pipe(gulp.dest('./web'))
});

// usermin
gulp.task('usemin', function() {
    return gulp.src(['./*.html', './*/*.html'])
        .pipe($.usemin({
            css: [$.cssnano],
            html: [$.htmlmin],
            js: [$.uglify],
            inlinejs: [$.uglify],
            inlinecss: [$.cssnano, 'concat']
        }))
        .pipe(gulp.dest('./.tmp'));
});

// lint html
gulp.task('htmllint', function() {
    return gulp.src('./**/*.html')
        .pipe($.htmlhint())
        //.pipe($.htmlhint.reporter());
});

// lint sass
gulp.task('csslint', function() {
    return gulp.src('./stylesheet/**/*.s+(a|c)ss')
        .pipe($.sassLint())
        .pipe($.sassLint.format())
        .pipe($.sassLint.failOnError());
});

// lint js
gulp.task('jslint', function() {
    return gulp.src('./js/**/*.js')
        .pipe($.jshint())
        //.pipe($.jshint.reporter('jshint-stylish'))
        .pipe(browserSync.stream());
});

gulp.task('clean', function () {
    return gulp.src(['./.tmp',"./web/rev-manifest.json"], {read: false})
        .pipe(clean());
});


// build
gulp.task('build', function () {
    runSequence('clean',"htmllint","csslint",'css',"jslint","images","usemin", 'rev','clean');
});

