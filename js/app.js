/*jslint unparam: true, maxlen: 80 */
define([], function () {
  "use strict";
  var that = {}, App = {};
  that.start = function () {
    jQuery.extend(jQuery.mobile.datebox.prototype.options, {
      'overrideDateFormat': '%d/%m/%Y',
      'overrideHeaderFormat': '%d/%m/%Y'
    });
    var jio = jIO.newJio({
        "type": "local",
        "username": "Marco",
        "application_name": "Marco_PMAPI"
      }),
      jio_state = jIO.newJio({
        "type": "local",
        "username": "Marco",
        "application_name": "Marco_PMAPI_state"
      }),
      jio_project = jIO.newJio({
        "type": "local",
        "username": "Marco",
        "application_name": "Marco_PMAPI_project"
      });
    //$("#index").on("pagecreate", function () {
      localStorage.clear();
      jio_state.post({
        "_id": "ST-1",
        "state": "started"
      });
      jio_state.post({
        "_id": "ST-2",
        "state": "continues"
      });
      jio_state.post({
        "_id": "ST-3",
        "state": "complete"
      });
      jio_state.post({
        "_id": "ST-4",
        "state": "down"
      });
      //creating projects
      jio_project.post({
        "_id": "PR-1",
        "project": "Daily activity"
      });
      jio_project.post({
        "_id": "PR-2",
        "project": "Weekly activity"
      });
      jio_project.post({
        "_id": "PR-3",
        "project": "Weekend activity"
      });
       // creating tasks
      jio.post({
        "_id": "T-5444",
        "title": "Jquery mobile learning",
        "project": "Daily activity",
        "begindate": "20/05/2013",
        "enddate": "16/11/2013",
        "state": "following",
        "description": "some description ..."
      });
      jio.post({
        "_id": "T-5446",
        "title": "Create a jQuery Mobile Task Manager",
        "project": "Weekly activity",
        "begindate": "01/06/2013",
        "enddate": "30/06/2013",
        "state": "started",
        "description": "task manager app with JQM"
      });
      jio.post({
        "_id": "T-5447",
        "title": "Going to the restaurent",
        "project": "Weekend activity",
        "begindate": "11/07/2013",
        "enddate": "12/07/2013",
        "state": "complete",
        "description": "task on jQuery"
      });
      jio.post({
        "_id": "T-5448",
        "title": "Going to shopping",
        "project": "Weekend activity",
        "begindate": "11/07/2013",
        "enddate": "13/08/2013",
        "state": "complete",
        "description": "task on jQuery"
      });
   // });

    $(document).on("pagebeforeshow", "#index", function () {
      //$(document).off(".index_setup");
      require(["indexMod"], function (indexmod) {
        indexmod.init(jio, jio_state);
      });
    });

    $(document).on("pagebeforeshow", "#projects", function () {
      require(["projectMod"], function (project) {
        project.init(jio, jio_state, jio_project);
      });
    });

    $(document).on("pagecreate.details_setup", "#details", function () {
      $(document).off(".details_setup");
      require(["detailsMod"], function (details) {
        details.init(jio, jio_state, jio_project);
        //window.App.populateDetails = details.populateDetails;
        App.populateDetails = details.populateDetails;
      });
    });

    $(document).on("pageshow", "#details", function () {
      setTimeout(function () {
        App.populateDetails(jio, jio_state, jio_project);
      }, 150);
    });

    $(document).on("pagecreate.settings_setup", "#settings", function () {
      $(document).off(".settings_setup");
      require(["settingsMod"], function (settings) {
        settings.init(jio, jio_state, jio_project);
        App.populateSettings = settings.populateSettings;
      });
    });

    $(document).on("pageshow", "#settings", function () {
      setTimeout(function () {
        App.populateSettings(jio, jio_state, jio_project);
      }, 100);
    });

    $.mobile.initializePage();
  }

  //window.App = App;
  return that;
});
