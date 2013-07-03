  /*jslint indent: 2, maxlen: 80, nomen: true */
  /*global localStorage:true, jIO:true, $:true, */
  /*console:true, setTimeout:true, document:true */
define(
    [
    "jquery",
    "jqm",
    "jio",
    "localstorage",
    "complex_queries",
    "revisionstorage"
    ],

  function($, jqm, jio, localstorage, cmplexqueries) {

    console.log($);
    console.log(jio);
    console.log(localstorage);
    console.log(cmplexqueries);
  (function () {
    "use strict";
    // global variables
    var timer = null;
    var filterValue;
    var query_object;
    var  SELECT_TASK_ID;

    console.log("loadeddd");
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
      }, function (err, response) {console.log(response)});


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
      }, function (err, response) {console.log(response)});

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
	// console.log(response);
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
	 console.log(response);
      });

    });


    $(document).on("pagebeforeshow", "#index", function (e, data) {

      if( $('.projectbutton').hasClass('ui-btn-active') )
	$('.projectbutton').removeClass('ui-btn-active');
      if( $('.settingsbutton').hasClass('ui-btn-active') )
	$('.settingsbutton').removeClass('ui-btn-active');
      $('.tasklistbutton').addClass('ui-btn-active');

      //$('.tasklistbutton').toggleClass('ui-btn-active');
      setTimeout(function () {
	var str = "";
	jio.allDocs(
	  { "include_docs": true }, //so to get no only the nID of docs, but all infrmations about

	  function (err, response) {
	    // console.log(response);
	    var i;

	    for (i = 0; i < response.total_rows; i += 1) {
	      var ftext = response.rows[i].doc.title +" "+ response.rows[i].doc.project + " " + response.rows[i].doc.state + " " + response.rows[i].doc.begindate + " " + response.rows[i].doc.enddate;

	      str += "<li data-id='" + response.rows[i].doc._id + "'";
	      str += " data-filtertext='" + ftext + "'>";
	      str += " <a class='myLink' data-transition='slide' id='" + response.rows[i].doc._id + "' href= 'details.html?_id=" +  response.rows[i].doc._id + "'><span class='titleSpan'>";
	      str += response.rows[i].doc.title + "</span><br/><i>from " + response.rows[i].doc.begindate + "&nbsp;to " + response.rows[i].doc.enddate + "</i><br/><span class='myspan'>" + response.rows[i].doc.state;
	      str += "</span> </a><a data-role='button' data-id= '" +  response.rows[i].doc._id + "' data-position-to='window' class='popupbutton' data-rel='popup' href='#mypopup' data-icon='gear'></a></li>";

	    }// sublime text 2
	    //console.log("rep:  "+str);
	    $(".content-listview").empty().append(str).listview("refresh");  // popup(something) for popup
	  }
	    );
      }, 50);
    });
	  }());

  });

