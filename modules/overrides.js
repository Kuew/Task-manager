
(function ($, document) {
  "use strict";
  $(document).bind("mobileinit", function () {
    // [JQM] - trigger JQM manually
    $.mobile.autoInitializePage = false;
  });
	jQuery.extend(jQuery.mobile.datebox.prototype.options, {
		'overrideDateFormat': '%d/%m/%Y',
		'overrideHeaderFormat': '%d/%m/%Y'
	});
}(jQuery, document));