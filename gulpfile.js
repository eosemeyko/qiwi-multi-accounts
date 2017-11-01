const path = require('path'),
    gulp = require('gulp'),
    minCSS = require('gulp-clean-css'), // Минификация CSS
    js_min = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов
    ngAnnotate = require('gulp-ng-annotate'); // Аннотации для AngularJS

gulp.task('default', ['css', 'js'],function(){});
gulp.task('css', ['css-style', 'css-plugins'],function(){});
gulp.task('js', ['js-app', 'js-plugins', 'js-core'],function(){});

const vendor = ('bower_components/'),
    assets_src = path.join(__dirname, './web/assets/'),
    assets_css = path.join(__dirname, './web/public/assets/css'),
    assets_js = path.join(__dirname, './web/public/assets/js');

/**
 * CSS
 */
gulp.task('css-style', () =>
    gulp.src(assets_src + 'css/*.css')
        .pipe(minCSS())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(assets_css))
);
gulp.task('css-plugins', () =>
    gulp.src([
        vendor + 'bootstrap/dist/css/bootstrap.css',
        vendor + 'angular-confirm/css/angular-confirm.css'
    ])
        .pipe(minCSS())
        .pipe(concat('plugins.css'))
        .pipe(gulp.dest(assets_css))
);

/**
 * Javascript
 */
gulp.task('js-app', () =>
    gulp.src(path.join(__dirname, './web/app/**/*.js'))
        .pipe(ngAnnotate())
        .pipe(js_min())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(assets_js))
);
gulp.task('js-plugins', () =>
    gulp.src([
        vendor + 'jquery/dist/jquery.min.js',
        vendor + 'bootstrap/dist/js/bootstrap.min.js'
    ])
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest(assets_js))
);
gulp.task('js-core', () =>
    gulp.src([
        vendor + 'angular/angular.js',
        vendor + 'angular-sanitize/angular-sanitize.js',
        vendor + 'angular-bootstrap/ui-bootstrap-tpls.js',
        vendor + 'angular-confirm/js/angular-confirm.js'
    ])
        .pipe(ngAnnotate())
        .pipe(js_min())
        .pipe(concat('core.js'))
        .pipe(gulp.dest(assets_js))
);

/**
 * Watch files
 */
gulp.task('watch', () => {
    gulp.watch(path.join(__dirname, './web/app/**/*.js'), ['js-app']);
    gulp.watch(assets_src + 'css/*.css', ['css-style']);
});