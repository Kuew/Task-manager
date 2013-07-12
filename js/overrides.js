(function ($, document) {
  "use strict";
  $(document).bind("mobileinit", function () {
    //[JQM] - trigger JQM manually
    $.mobile.autoInitializePage = false;
  });
}(jQuery, document));

