module.exports = function(grunt) {
    'use strict';

    var sass    = grunt.config('sass') || {};
    var watch   = grunt.config('watch') || {};
    var notify  = grunt.config('notify') || {};
    var root    = grunt.option('root') + '/taoTestRunnerTools/views/';

    sass.taotestrunnertools = { };
    sass.taotestrunnertools.files = { };
    sass.taotestrunnertools.files[root + 'css/testrunner.css'] = root + 'scss/testrunner.scss';

    watch.taotestrunnertoolssass = {
        files : [root + 'scss/**/*.scss'],
        tasks : ['sass:taotestrunnertools', 'notify:taotestrunnertoolssass'],
        options : {
            debounceDelay : 1000
        }
    };

    notify.taotestrunnertoolssass = {
        options: {
            title: 'Grunt SASS',
            message: 'SASS files compiled to CSS'
        }
    };

    grunt.config('sass', sass);
    grunt.config('watch', watch);
    grunt.config('notify', notify);

    //register an alias for main build
    grunt.registerTask('taotestrunnertoolssass', ['sass:taotestrunnertools']);
};
