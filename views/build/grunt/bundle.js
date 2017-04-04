module.exports = function(grunt) {
    'use strict';

    var requirejs   = grunt.config('requirejs') || {};
    var clean       = grunt.config('clean') || {};
    var copy        = grunt.config('copy') || {};

    var root        = grunt.option('root');
    var libs        = grunt.option('mainlibs');
    var ext         = require(root + '/tao/views/build/tasks/helpers/extensions')(grunt, root);
    var out         = 'output';

    /**
     * Remove bundled and bundling files
     */
    clean.taotestrunnertoolsbundle = [out];

    /**
     * Compile tao files into a bundle
     */
    requirejs.taotestrunnertoolsbundle = {
        options: {
            baseUrl : '../js',
            dir : out,
            mainConfigFile : './config/requirejs.build.js',
            paths : {
                'taoTestRunnerTools' : root + '/taoTestRunnerTools/views/js',
                'taoTestRunnerToolsCss' : root + '/taoTestRunnerTools/views/css'
            },
            modules : [{
                name: 'taoTestRunnerTools/controller/routes',
                include : ext.getExtensionsControllers(['taoTestRunnerTools']),
                exclude : ['mathJax'].concat(libs)
            }]
        }
    };

    /**
     * copy the bundles to the right place
     */
    copy.taotestrunnertoolsbundle = {
        files: [
            { src: [out + '/taoTestRunnerTools/controller/routes.js'],  dest: root + '/taoTestRunnerTools/views/js/controllers.min.js' },
            { src: [out + '/taoTestRunnerTools/controller/routes.js.map'],  dest: root + '/taoTestRunnerTools/views/js/controllers.min.js.map' }
        ]
    };

    grunt.config('clean', clean);
    grunt.config('requirejs', requirejs);
    grunt.config('copy', copy);

    // bundle task
    grunt.registerTask('taotestrunnertoolsbundle', ['clean:taotestrunnertoolsbundle', 'requirejs:taotestrunnertoolsbundle', 'copy:taotestrunnertoolsbundle']);
};
