System.config({
  paths: {
    '*': '*.js',
    'angular2/*': 'angular2/*',
  }
});
System.import('app');
System.import('room');
System.import('door');
System.import('tools');