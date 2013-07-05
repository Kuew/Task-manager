(function () {
  "use strict";
  // var IS_LOCAL= /(:\/\/localhost|file:\/\/)/.test(document.location.href);
  require.config({
    //  waitSeconds :  (IS_LOCAL? 10 : 45),
            paths: {
              //jquery and jqm plugin
                          jquery:      "plugins/jquery/jquery-1.8.3",
                 jqm:         "plugins/jquerymobile/jquery.mobile-1.3.1",
                 //datebox plugin
                 dateboxCoreMin:    "plugins/datebox/jqm-datebox.core.min",
                 dbxModeDateboxMin: "plugins/datebox/jqm-datebox.mode.datebox.min",
                 dbxModeCalboxMin: "plugins/datebox/jqm-datebox.mode.calbox.min",
                 dbxI18nEnUsUtf: "plugins/datebox/jqm.datebox.i18n.en_US.utf8",
                 simpledialogMin:   "plugins/datebox/jqm.simpledialog.min",
                 gpretty_prettify:  "plugins/datebox/gpretty_prettify",
                 //jio plugins
                 jio: "plugins/jio/jio",
                 md5: "plugins/jio/md5",
                 response: "plugins/jio/response",
                 localstorage: "plugins/jio/localstorage",
                 revisionstorage: "plugins/jio/revisionstorage",
                 complex_queries: "plugins/jio/complex_queries",
                 // page modules
                 app: "app",
                 indexMod: "../modules/index/indexMod",
                 overrides: "../modules/overrides",
                 projectMod: "../modules/project/projectMod",
                 detailsMod: "../modules/details/detailsMod",
                 settingsMod: "../modules/settings/settingsMod"
            },
            shim: {
              "jio": {deps: ["md5"]},
              "jquery": {exports: "$"},
              "localstorage": {deps: ["jio"]},
              "revisionstorage": {deps: ["jio"]},
              "complex_queries": {deps: ["jio"]},
              "jqm":     { deps: ["jquery"], exports: "mobile" },
              "dateboxCoreMin": {deps: ["jqm"]},
              "gpretty_prettify": {deps: ["dateboxCoreMin"]},
              "simpledialogMin": {deps: ["dateboxCoreMin"]},
              "dbxI18nEnUsUtf": {deps: ["dateboxCoreMin"]},
              "dbxModeDateboxMin": {deps: ["dateboxCoreMin"]},
              "dbxModeCalboxMin": {deps: ["dateboxCoreMin"]},
              "overrides": {deps: ["jquery"]}
            }
  });
  // use almond when building into a single file for phonegap
  define(
    [ //needed module wether the user start in index|detail|projetc html
                "jquery",
         "jqm",
         "dateboxCoreMin",
         "dbxModeDateboxMin",
         "dbxModeCalboxMin",
         "dbxI18nEnUsUtf",
         "simpledialogMin",
         "gpretty_prettify",
         "jio",
         "md5",
         "response",
         "localstorage",
         "revisionstorage",
         "complex_queries",
         //pages modules
         "overrides"
    ],
    function () {
      require(['app'], function (App) {
        App.start();
      });
    }
  );
}());
