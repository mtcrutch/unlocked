// modules
var gulp = require("gulp"),
    path = require("path"),
    pkg = require("./package.json"),
    karma = require('karma').server,
    Dgeni = require('dgeni'),
    del = require("del"),
    $ = require('gulp-load-plugins')();

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
    SRC_TS_SPEC_ALL  = path.join('tests', "**", "*.ts"),
    SRC_IMAGES_ALL  = path.join(SRC_IMAGES_BASE, "**", "*"),
    DIST = pkg.dist,
    DIST_LIB = path.join(DIST, "lib"),
    DIST_ALL = path.join(DIST, "**"),
    DIST_LESS = path.join(DIST, "css"),
    DIST_JAVASCRIPT = path.join(DIST, "js"),
    DIST_SPEC_JAVASCRIPT = path.join(DIST, "tests"),
    DIST_IMAGES = path.join(DIST, "images"),
    MAIN_SCRIPT = pkg.name + "-" + pkg.version + ".js",
    MAIN_CSS = pkg.name + "-" + pkg.version + ".css",
    CUSTOM_BOOTSTRAP_CSS = "custom-bootstrap-" + pkg.name + "-" + pkg.version + ".css",
    CSSDEPENDENCIES = [],
    DEPENDENCIES = ["angular.js", "router.es5.js", "system.src.js"],
    KARMA = {
      cfg: __dirname + "/karma-config.js",
      browsers: ['PhantomJS'],
      dependencies: ["node_modules/angular/angular.js",
                     "node_modules/angular-mocks/angular-mocks.js",
                     "node_modules/angular-new-router/dist/router.es5.js",
                     "node_modules/systemjs/dist/system.src.js",
                     "node_modules/es6-module-loader/dist/es6-module-loader.js"],
      frameworks: ['jasmine']
    };

// Default
gulp.task("default", ["run"]);

// default run/watch build task
gulp.task("run", run);

// Compile everything
gulp.task("compile", ["copy-dependencies", "copy-vendor", "compile:less", "lint:ts",
                      "compile:javascript", "compile:specs", "compile:html2js", "compile:images"]);


// Dist everything
gulp.task("dist", ["copy-dependencies", "copy-vendor", "compile:html", "compile:less",
	               "compile:javascript", "compile:specs", "compile:html2js", "compile:images"]);
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
// compile those TS scripts
gulp.task("compile:javascript", [], function() {
  return compileTS(SRC_TS_ALL, DIST_JAVASCRIPT)
      .on('end', compileHtml);
});

// compile those TS spec scripts
gulp.task("compile:specs", [], function() {
  return compileTS(SRC_TS_SPEC_ALL, DIST_SPEC_JAVASCRIPT)
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
    .pipe($.imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
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
    .pipe($.template({pkg: pkg,
                    dependencies: DEPENDENCIES,
                    cssDependencies: CSSDEPENDENCIES}))
    .pipe($.inject(gulp.src(DIST_JAVASCRIPT + '/**/*.js').pipe($.angularFilesort())))
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
    .pipe($.ngmin()) // ngmin makes angular injection syntax compatible with uglify
    .pipe(uglify())
    .pipe(gulp.dest(DIST_JAVASCRIPT));
}

// lint
function lintTs() {
  return gulp.src(SRC_TS_ALL)
      .pipe($.tslint('verbose'));
}

// compile all TS specs
function compileTS(inTs, outJs) {
  return gulp.src(inTs)
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.typescript({
        target: 'ES5',
        module: 'system',
        declaration: false,
        noImplicitAny: false,
        removeComments: true,
        noLib: false,
        typescript: require('typescript')
      }))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(outJs));
}

// loads a dev server
function server(next) {
  var port = process.env.PORT || 5000;
  var connect = require("connect");
  var server = connect();
  server.use(connect.static(DIST)).listen(port, next);
  $.util.log("Server up and running: http://localhost:" + port);
}

// minify CSS
function minCss() {
  return compileLess()
    .pipe($.minifyCss())
    .pipe(gulp.dest(DIST_LESS));
}

// help prompt
function help (next) {
  $.util.log("--- " + pkg.name + " ---");
  $.util.log("");
  $.util.log("See all of the available tasks:");
  $.util.log("$ gulp -T");
  $.util.log("");
  $.util.log("Run a dev mode server:");
  $.util.log("$ gulp dev");
  $.util.log("");
  $.util.log("Run a prod mode server:");
  $.util.log("$ gulp prod");
  next();
}

// test application
function testApp () {
    console.log(KARMA.cfg)
  karma.start({configFile: KARMA.cfg}, function (exitCode) {
    $.util.log('Karma has exited with ' + exitCode);
    process.exit(exitCode);
  });

}

// Compile app/less sources in CSS and auto-prefix the CSS
function compileLess() {
  return gulp.src(SRC_LESS_ALL)
    .pipe($.sourcemaps.init())
    .pipe($.less({ paths: [ path.join(SRC_LESS_BASE) ] }))
    .pipe($.autoprefixer("last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1", "ios 6", "android 4"))
    .pipe($.concat(MAIN_CSS))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(DIST_LESS))
}

// create the js templates file
function compileHTML2JS(){
  return gulp.src(SRC_TPL_HTML)
    .pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
    }))
    .pipe($.ngHtml2js({
        moduleName: MODULE_NAME + '.templates',
        prefix: ""
    }))
    .pipe($.concat("partials.min.js"))
    .pipe(gulp.dest(DIST + '/js'));
}
