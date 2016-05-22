var gulp    = require('gulp');
var path    = require('path');
var yargs   = require('yargs').argv;
var tpl     = require('gulp-template');
var rename  = require('gulp-rename');

/*
map of paths for using with the tasks below
 */
var paths = {
  blankTemplates: 'templates/api/*.**'
};

// helper funciton
var resolveToComponents = function(glob){
  glob = glob || '';
  return path.join('server', 'api', glob); // app/components/{glob}
};

gulp.task('endpoint', function(){
  var cap = function(val){
    return val.charAt(0).toUpperCase() + val.slice(1);
  };

  var name = yargs.name;
  var parentPath = yargs.parent || '';
  var destPath = path.join(resolveToComponents(), parentPath, name);

  return gulp.src(paths.blankTemplates)
    .pipe(tpl({
      name: name,
      upCaseName: cap(name)
    }))
    .pipe(rename(function(path){
      path.basename = path.basename.replace('endpoint', name);
    }))
    .pipe(gulp.dest(destPath));
});

