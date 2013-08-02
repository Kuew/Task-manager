/*jslint nomen: true, plusplus: true, unparam: true */
/*indent: 2, maxlen: 80, define: true */
(function () {
  "use strict";
  require.config({
  //  waitSeconds :  (IS_LOCAL? 10 : 45),
    paths: {
			css: "plugins/require-css/css",
			normalize: "plugins/require-css/normalize",
      //jquery and jqm plugin
      jquery:      "plugins/jquery/jquery-1.8.3",
      jqm:         "plugins/jquerymobile/jquery.mobile-1.4.0",
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
      overrides: "overrides",
			pmapi: "../pmapi"
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
      "pmapi": {deps: ["jqm", "complex_queries", "dateboxCoreMin"]},
      "overrides": {deps: ["jquery"]}
    },
    map: {
			"*": {
				"css": "plugins/require-css/css"
			}
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
      "overrides",
			"css!../pmapi.css",
			"css!plugins/jquerymobile/jquery.mobile-1.4.0",
			"css!plugins/datebox/jqm-datebox.min.css",
			"css!plugins/datebox/jquery.mobile.simpledialog.min.css",
			"css!plugins/datebox/datebox.css",
      "pmapi"
    ],
    function () { 
      console.log("2: main dependences loaded ");
    }
  );
}());
