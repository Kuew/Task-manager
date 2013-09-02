module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    /**********************************************
    ******* running jslint to all js files  *******
    **********************************************/
    jslint: {
      all: {
        src: [
          'js/main.js',
          'js/modules/*.js',
          'Gruntfile.js'
        ],
        exclude: [
          'js/modules/datebox.js',
          'js/modules/pmapi.js'
        ],
        directives: { // example directives
          browser: true,
          unparam: true,
          maxlen: 80,
          indent: 2,
          nomen: true,
          predef: [
            '$',
            'jIO',
            'alert',
            'jQuery',
            'window',
            'parent',
            'define',
            'require',
            'module',
            'console',
            'confirm',
            'location',
            'document',
            'inittasks',
            'setTimeout',
            'inserttasks',
            'insertstates',
            'localStorage',
            'displaytasks',
            'insertprojects'
          ]
        },
        options: {
          failOnError: false
        }
      }
    },

    /**********************************************
    ******* running jslint to all js files  *******
    **********************************************/
    requirejs: {
      compile: {
        options: {
          appDir: "./",
          // => INFO: directory path = PRODUCTION folder
          dir: "dir",
          config: {
            text: {
              removeWhitespace: true
            }
          },
          mainConfigFile: "js/main.js",
          // INFO => base url for all js file
          baseUrl: "js",
          paths: {
            //plugins (datebox, require-css, text, json)
            datebox:         "modules/datebox",
            css:             "plugins/requirejs-plugins/require-css/css",
            normalize:       "plugins/requirejs-plugins/require-css/normalize",
            text:            "plugins/requirejs-plugins/text/text",
            json:            "plugins/requirejs-plugins/json/json",
            //librairies (jquery, jquery mobile, jio)
            jquery:          "lib/jquery/jquery-1.8.3",
            jqm:             "lib/jquerymobile/jquery.mobile-1.3.2",
            jio:             "lib/jio/jio",
            md5:             "lib/jio/md5",
            response:        "lib/jio/response",
            localstorage:    "lib/jio/localstorage",
            revisionstorage: "lib/jio/revisionstorage",
            complex_queries: "lib/jio/complex_queries",
            //modules(overrides, common, pmapi)
            overrides:       "modules/overrides",
            common:          "modules/common",
            pmapi:           "modules/pmapi"
          },
          shim: {
            "jio": {deps: ["md5"]},
            "jquery": {exports: "$"},
            "localstorage": {deps: ["jio"]},
            "revisionstorage": {deps: ["jio"]},
            "complex_queries": {deps: ["jio"]},
            "jqm": {deps: ["jquery"], exports: "mobile"},
            "overrides": {deps: ["jquery"]},
            "pmapi": {deps: ["complex_queries", "datebox"]}
          },
          map: {
            "*": {"css": "plugins/requirejs-plugins/require-css/css"}
          },
          //built code is transformed in some way.
          keepBuildDir: true,
          optimize: "uglify2",
          //optimize: "none",
          //files.
          skipDirOptimize: false,
          //source maps as ".js.src" files.
          generateSourceMaps: false,
          normalizeDirDefines: "skip",
          //-"standard.keepComments.keepLines": keeps the file comments & line
          optimizeCss: "standard",
          inlineText: true,
          useStrict: false,
          //together.
          skipModuleInsertion: false,
          //will be placed on another domain.
          optimizeAllPluginResources: false,
          //by default.
          findNestedDependencies: true,
          //If set to true, any files that were combined into a build 
          //layer will be removed from the output folder.
          removeCombined: true,
          //only the root bundles will be included unless the locale: 
          //section is set above.
          modules: [
            {
              name: "common",
              include: ["css"]
            }
          ],
          //RegExp via new RegExp().
          fileExclusionRegExp: /^(dir|py|build|inputs|node_modules|grunt)$/,
          //work out how best to surface the license information.
          preserveLicenseComments: true,
          //Sets logging level.It's a number.If you want "silent" running,
          logLevel: 0,
          //this option
          throwWhen: {
            //If there is an error calling the minifier for some JavaScript,
            //instead of just skipping that file throw an error.
            optimize: true
          },
          //read in the disables the waiting interval.
          waitSeconds: 5
        }
      }
    },

    /**************************************************
    **** running html validation to all html files ****
    **************************************************/
    validation: {
      /*options: {
        reset: grunt.option('reset') || false,
        toponerror: false
      },*/
      files: {
        src: ['*.html']
      }
    },

    /**************************************************
    **** running html validation to all html files ****
    **************************************************/
    jsonlint: {
      sample: {
        src: [ 'data/tasks.json' ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-jsonlint');

  grunt.registerTask(
    'default',
    ['jslint', 'requirejs', 'validation', 'jsonlint']
  );
};

