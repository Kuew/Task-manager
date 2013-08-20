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
      jqm:         "plugins/jquerymobile/jquery.mobile-1.3.2",
			text:   "plugins/text/text",
			json:   "plugins/json/json",
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
      "jio": {deps: ["md5"]},
			"jquery": {exports: "$"},
      "localstorage": {deps: ["jio"]},
      "revisionstorage": {deps: ["jio"]},
      "complex_queries": {deps: ["jio"]},
      "jqm":     { deps: ["jquery"], exports: "mobile" },
      "dbxI18nEnUsUtf": {deps: ["datebox"]},
			"dbxModeDatebox": {deps: ["datebox"]},
			"dbxModeCalbox": {deps: ["datebox"]},
      "overrides": {deps: ["jquery"]},
			"pmapi": {deps: ["complex_queries", "datebox"]}
    },
    map: {
      "*": {
	      "css": "plugins/require-css/css"
      }
    }
  });
	define(["common"],
    function () {
      console.log("2: main dependences loaded ");
    }
  );
}());
