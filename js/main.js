/*jslint nomen: true, unparam: true, indent: 2, maxlen: 80*/
/*global define: true */
(function () {
  "use strict";
  require.config({
    //  waitSeconds :  (IS_LOCAL? 10 : 45),
    paths: {
      //plugins (require-css, text, json)
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
      //modules(datebox as module, overrides, common, pmapi)
      datebox:         "modules/datebox",
      overrides:       "modules/overrides",
      common:          "modules/common",
      pmapi:           "modules/pmapi"
    },
    shim: {
      "jio": {deps: ["md5"]},
      "jquery": {exports: "$"},
      "localstorage": {deps: ["jio"]},
      "revisionstorage": {deps: ["jio"]},
      "complex_queries": {deps: ["jio"]}, //a revoir
      "jqm":     { deps: ["jquery"], exports: "mobile" },
      "overrides": {deps: ["jquery"]},
      "pmapi": {deps: ["complex_queries", "datebox"]}
    },
    map: {
      "*": {
        "css": "plugins/requirejs-plugins/require-css/css"
      }
    }
  }
    );
  define(
    ["common"],
    function () {
      console.log("2: main dependences loaded ");
    }
  );
}());
