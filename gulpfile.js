// modules
var gulp = require("gulp"),
    path = require("path"),
    gutil = require("gulp-util"),
    rename = require("gulp-rename"),
    template = require("gulp-template"),
    plumber = require("gulp-plumber"),
    pkg = require("./package.json"),
    inject = require('gulp-inject'),
    sourcemaps = require('gulp-sourcemaps'),
    ngHtml2Js = require("gulp-ng-html2js"),
    concat = require('gulp-concat-util'),
    uglify = require("gulp-uglify"),
    minifyHtml = require("gulp-minify-html"),
    karma = require('karma').server,
    Dgeni = require('dgeni'),
    ts = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    del = require("del");

// settings for gulpfile
var MODULE_NAME =  "unlockedApp",
    SRC  = "app",
    SRC_LESS_BASE  = path.join(SRC, "."),
    SRC_TS_BASE  = path.join(SRC, "."),
    SRC_IMAGES_BASE  = path.join(SRC, "images"),
    SRC_ALL  = path.join(SRC, "**"),
    SRC_HTML  = path.join(SRC, ".", "**", "index.html"),
    SRC_TPL_HTML  = path.join(SRC, ".", "**", "*.tpl.html"),
    SRC_LESS_ALL  = path.join(SRC_LESS_BASE, "**", "*.less"),
    SRC_TS_ALL  = path.join(SRC_TS_BASE, "**", "*.ts"),
    SRC_JAVASCRIPT_SPEC_ALL  = path.join(path.join("tests","."), "**", "*.spec.js"),
    SRC_IMAGES_ALL  = path.join(SRC_IMAGES_BASE, "**", "*"),
    DIST = pkg.dist,
    DIST_LIB = path.join(DIST, "lib"),
    DIST_ALL = path.join(DIST, "**"),
    DIST_LESS = path.join(DIST, "css"),
    DIST_JAVASCRIPT = path.join(DIST, "js"),
    DIST_IMAGES = path.join(DIST, "images"),
    MAIN_SCRIPT = pkg.name + "-" + pkg.version + ".js",
    MAIN_CSS = pkg.name + "-" + pkg.version + ".css",
    CUSTOM_BOOTSTRAP_CSS = "custom-bootstrap-" + pkg.name + "-" + pkg.version + ".css",
    CSSDEPENDENCIES = [],
    DEPENDENCIES = ["angular.js", "router.es5.js"],
    KARMA = {
      browsers: ['PhantomJS'],
      dependencies: ["node_modules/angular/angular.js",
                     "node_modules/angular-mocks/angular-mocks.js",
                     "node_modules/angular-new-router/dist/router.es5.js"],
      frameworks: ['jasmine']
    };

// Default
gulp.task("default", ["run"]);

// default run/watch build task
gulp.task("run", run);

// Compile everything
gulp.task("compile", ["copy-dependencies", "copy-vendor", "compile:less", "lint:ts",
                      "compile:javascript", "compile:html2js", "compile:images"]);


// Dist everything
gulp.task("dist", ["copy-dependencies", "copy-vendor", "compile:html", "compile:less", 
	               "compile:javascript",  "compile:html2js", "compile:images"]);
// Help
gulp.task("help", help);
// Prod Server
gulp.task("prod-server", ["server", "dist"]);
// production build
gulp.task("prod", ["compile"]);
// compile all less code
gulp.task("compile:less", [], function() {
  return compileLess();
});
// Minify the CSS
gulp.task("dist:less", [], minCss);
//tests
gulp.task('test', testApp);
// Server that serves static content from DIST
gulp.task("server", ["compile"], server);
//docs
gulp.task('dgeni', function() {
  var dgeni = new Dgeni([require('./docs/dgeni')]);
  return dgeni.generate();
});
gulp.task('lint:ts', [], lintTs);
// compile those scripts
gulp.task("compile:javascript", [], function() {
  return compileJavaScript()
      .on('end', compileHtml);
});
// turn html to scripts
gulp.task("compile:html2js", [], function() {
  return compileHTML2JS();
});
// Uglify the JS
gulp.task("dist:javascript", [], minJs);
// compile images together
gulp.task("compile:images", [], compileImages);
// Compress the images
gulp.task("dist:images", [], compressImages);
// interpolates values into html templates
gulp.task("compile:html", [], compileHtml);
// Copy Bower assets
gulp.task("copy-dependencies", [], copyDependencies);
// Copy Vendor assets
gulp.task("copy-vendor", [], copyVendor);
// Clean the DIST dir
gulp.task("clean", deleteFiles);

// default gulp build
function run() {

  gulp.watch(SRC_ALL, ["compile", "compile:html"]);

//  var lrserver = require("gulp-livereload")();

//  gulp.watch(DIST_ALL).on("change", function(file) {
//    lrserver.changed(file.path);
//  });

}

// compress images
function compressImages() {
  return gulp.src(SRC_IMAGES_ALL)
    .pipe(require("gulp-imagemin")({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(DIST_IMAGES));
}

// copy all vendor files
function copyVendor() {
  return gulp.src("vendor/**")
    .pipe(gulp.dest(DIST_LIB));
}

// copy all bower files
function copyDependencies() {
  return gulp.src(KARMA.dependencies)
    .pipe(gulp.dest(DIST_LIB));
}

// compiles all html and interpolates values into the templates
function compileHtml() {
  return gulp.src(SRC_HTML)
    .pipe(template({pkg: pkg,
                    dependencies: DEPENDENCIES,
                    cssDependencies: CSSDEPENDENCIES}))
    .pipe(inject(gulp.src(DIST_JAVASCRIPT + '/**/*.js'), {read: false}))
    .pipe(gulp.dest(DIST));
}

// deletes all files in dist
function deleteFiles() {
  return gulp.src([DIST, ".build"], {read: false})
    .pipe(del());
}

// gathers all images in src and add them to dist
function compileImages() {
  return gulp.src(SRC_IMAGES_ALL)
    .pipe(gulp.dest(DIST_IMAGES));
}

function minJs() {
  return compileJavaScript()
    .pipe(require('gulp-ngmin')()) // ngmin makes angular injection syntax compatible with uglify
    .pipe(uglify())
    .pipe(gulp.dest(DIST_JAVASCRIPT));
}

// lint
function lintTs() {
  return gulp.src(SRC_TS_ALL)
      .pipe(tslint('prose'));
}

// transpile all JS
function compileJavaScript() {
  return gulp.src(SRC_TS_ALL)
      .pipe(plumber())
      .pipe(ts({
        target: 'ES5', 
        typescript: require('typescript')
      }))
      .pipe(gulp.dest(DIST_JAVASCRIPT));
}

// loads a dev server
function server(next) {
  var port = process.env.PORT || 5000;
  var connect = require("connect");
  var server = connect();
  server.use(connect.static(DIST)).listen(port, next);
  gutil.log("Server up and running: http://localhost:" + port);
}

// minify CSS
function minCss() {
  return compileLess()
    .pipe(require('gulp-minify-css')())
    .pipe(gulp.dest(DIST_LESS));
}

// help prompt
function help (next) {
  gutil.log("--- " + pkg.name + " ---");
  gutil.log("");
  gutil.log("See all of the available tasks:");
  gutil.log("$ gulp -T");
  gutil.log("");
  gutil.log("Run a dev mode server:");
  gutil.log("$ gulp dev");
  gutil.log("");
  gutil.log("Run a prod mode server:");
  gutil.log("$ gulp prod");
  next();
}

// test application
function testApp () {
  karma.start({ 
    basePath: '.',
    browsers: KARMA.browsers, 
    files: KARMA.dependencies.concat(DIST + "/js/*.js")
                             .concat(SRC_JAVASCRIPT_SPEC_ALL), 
    frameworks: KARMA.frameworks, 
    singleRun: true 
  }, function (exitCode) { 
    gutil.log('Karma has exited with ' + exitCode); 
    process.exit(exitCode); 
  }); 

}

// Compile app/less sources in CSS and auto-prefix the CSS
function compileLess() {
  return gulp.src(SRC_LESS_ALL)
    .pipe(sourcemaps.init())
    .pipe(require("gulp-less")({ paths: [ path.join(SRC_LESS_BASE) ] }))
    .pipe(require("gulp-autoprefixer")("last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1", "ios 6", "android 4"))
    .pipe(concat(MAIN_CSS))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_LESS))
}

// create the js templates file
function compileHTML2JS(){
  return gulp.src(SRC_TPL_HTML)
    .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
    }))
    .pipe(ngHtml2Js({
        moduleName: MODULE_NAME + '.templates',
        prefix: ""
    }))
    .pipe(concat("partials.min.js"))
    .pipe(gulp.dest(DIST + '/js'));
}
