define([], function () {
  "use strict";

  var that = {};
  that.start = function() {

    // 1- create a new jio (type = localStorage)
    var jio = jIO.newJio({
      "type": "local",
      "username": "Marco",
      "application_name": "Marco_PMAPI"
    });
    var jio_state = jIO.newJio({
      "type": "local",
      "username": "Marco",
      "application_name": "Marco_PMAPI_state"
    });
    var jio_project = jIO.newJio({
      "type": "local",
      "username": "Marco",
      "application_name": "Marco_PMAPI_project"
    });

    $("#index").on("pagecreate", function () {
    localStorage.clear();
    //creatings states

    //creatings default states
    jio_state.post({
      "_id": "ST-1",
      "state": "started"
    }, function (err, response) {});

    jio_state.post({
      "_id": "ST-2",
      "state": "continues"
    }, function (err, response) {});

    jio_state.post({
      "_id": "ST-3",
      "state": "complete"
    }, function (err, response) {});

    jio_state.post({
      "_id": "ST-4",
      "state": "down"
    }, function (err, response) {});


    //creating projects
    jio_project.post({
      "_id": "PR-1",
      "project": "Daily activity"
    }, function (err, response) {});

    jio_project.post({
      "_id": "PR-2",
      "project": "Weekly activity"
    }, function (err, response) {});

    jio_project.post({
      "_id": "PR-3",
      "project": "Weekend activity"
    }, function (err, response) {});

    ////////////////////////
    // creating tasks
    jio.post({
      "_id": "T-5444",
      "title": "Jquery mobile learning",
      "project": "Daily activity",
      "begindate": "20/05/2013",
      "enddate": "6/06/2013",
      "state": "following",
      "description": "some description ..."

    }, function (err, response) {
      // console.log(response);
    });
    jio.post({
      "_id": "T-5446",
      "title": "Create a jQuery Mobile Task Manager",
      "project": "Daily activity",
      "begindate": "22/06/2013",
      "enddate": "24/08/2013",
      "state": "started",
      "description": "task manager app with JQM"

    }, function (err, response) {
       //console.log(response);
    });

    jio.post({
      "_id": "T-5447",
      "title": "Going to the restaurent",
      "project": "Restaurent actions",
      "begindate": "2/06/2013",
      "enddate": "5/07/2013",
      "state": "complete",
      "description": "task on jQuery"

    }, function (err, response) {
     // console.log(response);
    });

    jio.post({
      "_id": "T-5448",
      "title": "Going to shopping",
      "project": "Weekend activity",
      "begindate": "7/09/2013",
      "enddate": "12/12/2013",
      "state": "complete",
      "description": "task on jQuery"

    }, function (err, response) {
      //console.log(response);
    });
  });

  $(document).on("pagebeforeshow", "#index", function() {
      require(["indexMod"], function(indexmod) {
        indexmod.init(jio, jio_state);
      });
  });

    $(document).on("pagebeforeshow", "#projects", function() {
      require(["projectMod"], function (project) {
     // console.log("beforecreateproject");
           project.init(jio, jio_state, jio_project);
     });
    });

    $(document).on("pagebeforeshow", "#details", function() {
      require(["detailsMod"], function (details) {
     // console.log("beforecreateproject");
           details.init(jio, jio_state, jio_project);
     });
    });


    $.mobile.initializePage();
  }
  return that;
});