/*jslint unparam: true, maxlen: 80, indent: 2, nomen: true*/
/*global jQuery, document*/
(function ($, document) {
  "use strict";
  $(document).bind("mobileinit", function () {
    //[JQM] - trigger JQM manually
    $.mobile.autoInitializePage = false;
  });
}(jQuery, document));

