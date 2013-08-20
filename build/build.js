({
  // INFO => directory containing application (relative from this file)
  appDir: "../",
  // => INFO: directory path = PRODUCTION folder
  //The directory path to save the output. If not specified, then
  //the path will default to be a directory called "build" as a sibling
  //to the build file. All relative paths are relative to the build file.
  dir: "../dir",
  config: {
    text: {
      removeWhitespace: true
    }
  },
  mainConfigFile: "../js/main.js",
  // INFO => base url for all js file
  baseUrl: "js",
  paths: {
    css: "plugins/require-css/css",
    normalize: "plugins/require-css/normalize",
    //jquery and jqm plugin
    jquery: "plugins/jquery/jquery-1.8.3",
    jqm: "plugins/jquerymobile/jquery.mobile-1.4.0",
    text: "plugins/text/text",
    json: "plugins/json/json",
    datebox: "datebox",
    //datebox plugin
    dbxModeDatebox: "plugins/datebox/jqm-datebox.mode.datebox",
    dbxModeCalbox: "plugins/datebox/jqm-datebox.mode.calbox",
    dbxI18nEnUsUtf: "plugins/datebox/jqm.datebox.i18n.en_US.utf8",
    //jio plugins
    jio: "plugins/jio/jio",
    md5: "plugins/jio/md5",
    response: "plugins/jio/response",
    localstorage: "plugins/jio/localstorage",
    revisionstorage: "plugins/jio/revisionstorage",
    complex_queries: "plugins/jio/complex_queries",
    overrides: "overrides",
    common: "common",
    pmapi: "pmapi"
  },
  shim: {
    "jio": {
      deps: ["md5"]
    },
    "jquery": {
      exports: "$"
    },
    "localstorage": {
      deps: ["jio"]
    },
    "revisionstorage": {
      deps: ["jio"]
    },
    "complex_queries": {
      deps: ["jio"]
    },
    "jqm": {
      deps: ["jquery"],
      exports: "mobile"
    },
    "dbxI18nEnUsUtf": {
      deps: ["datebox"]
    },
    "dbxModeDatebox": {
      deps: ["datebox"]
    },
    "dbxModeCalbox": {
      deps: ["datebox"]
    },
    "overrides": {
      deps: ["jquery"]
    },
    "pmapi": {
      deps: ["complex_queries", "datebox"]
    }
  },
  map: {
    "*": {
      "css": "plugins/require-css/css"
    }
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
  //- "standard.keepComments.keepLines": keeps the file comments and line
  optimizeCss: "standard",
  inlineText: true,
  useStrict: false,
  //together.
  skipModuleInsertion: false,
  //will be placed on another domain.
  optimizeAllPluginResources: false,
  //by default.
  findNestedDependencies: true,
  //If set to true, any files that were combined into a build layer will be
  //removed from the output folder.
  removeCombined: true,
  //only the root bundles will be included unless the locale: section is set above.
  modules: [
    {
      name: "common",
      include: ["css"]
   }
    ],
  //RegExp via new RegExp().
  fileExclusionRegExp: /^(dir|py|build|inputs)$/,
  //work out how best to surface the license information.
  preserveLicenseComments: true,
  //Sets the logging level. It is a number. If you want "silent" running,
  logLevel: 0,
  //this option
  throwWhen: {
    //If there is an error calling the minifier for some JavaScript,
    //instead of just skipping that file throw an error.
    optimize: true
  },
  //A function that if defined will be called for every file read in the
  //disables the waiting interval.
  waitSeconds: 7
})
