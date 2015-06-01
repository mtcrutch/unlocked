// Karma configuration
// Generated on Thu Sep 25 2014 11:52:02 GMT-0700 (PDT)
module.exports = function(config) {
  config.set({

    frameworks: ['jasmine'],

    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-new-router/dist/router.es5.js',
      // zone-microtask must be included first as it contains a Promise monkey patch
      // 'node_modules/zone.js/dist/zone-microtask.js',
      // 'node_modules/zone.js/dist/long-stack-trace-zone.js',

      // 'node_modules/traceur/bin/traceur-runtime.js',
      'node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.src.js',
      // Including systemjs because it defines `__eval`, which produces correct stack traces.
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/systemjs/lib/extension-register.js',
      'node_modules/systemjs/lib/extension-cjs.js',
      // 'node_modules/rx/dist/rx.js',
      // 'node_modules/reflect-metadata/Reflect.js',
      {pattern: 'dist/js/**/*.js', included: true, watched: false},
      {pattern: 'dist/tests/**/*.spec.js', included: true, watched: false}
    ],

    exclude: [],

    customLaunchers: {
      DartiumWithWebPlatform: {
        base: 'Dartium',
        flags: ['--enable-experimental-web-platform-features'] },
      ChromeNoSandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox'] }
    },
    reporters: ['progress'],
    browsers: ['ChromeCanary'],
    singleRun: true,

    port: 9876
  });
};
