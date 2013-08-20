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
	 "css!plugins/jquerymobile/jquery.mobile-1.4.0.css",
	 "css!plugins/datebox/jqm-datebox.css",
	 "overrides"
	],
	function () {
		/*
		define([
		    "datebox"
		], function () {
			"use strict";
				require([
					"dbxI18nEnUsUtf",
					"dbxModeDatebox",
					"dbxModeCalbox",
				],
				function () {
					console.log("datebox deps loaded");
				return undefined;
				});
		});
*/
		require([
			"pmapi"
		],
		function () {
			console.log("pmapi loaded");
			return undefined;
		});
		return undefined;
	}
);
