define(
  [
    "jquery",
    "jqm",
    "datebox",
    "jio",
    "md5",
    "json",
    "text",
    "response",
    "localstorage",
    "revisionstorage",
    "complex_queries",
    "css",
    "css!../pmapi.css",
    "css!lib/jquerymobile/jquery.mobile-1.3.2.css",
    "css!plugins/datebox/jqm-datebox.css",
    "overrides"
  ],
  function () {
    "use strict";
    require([
      "pmapi"
    ],
      function () {
        console.log("1. pmapi loaded in common");
        jQuery.extend(jQuery.mobile.datebox.prototype.options, {
          'overrideDateFormat': '%d/%m/%Y',
          'overrideHeaderFormat': '%d/%m/%Y'
        });
        return undefined;
      });
    return undefined;
  }
);
