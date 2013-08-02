/*jslint unparam: true, maxlen: 80, indent: 2, nomen: true*/
/*global jQuery, window, console, jIO, localStorage, alert, jQuery,
setTimeout, insertstates, insertprojects, inserttasks, displaytasks, define,
document, $, confirm, location, parent*/
(function () {
  "use strict";
  console.log("2: pmapi file loaded");
  $.mobile.autoInitializePage = false;
  jQuery.extend(jQuery.mobile.datebox.prototype.options, {
    'overrideDateFormat': '%d/%m/%Y',
    'overrideHeaderFormat': '%d/%m/%Y'
  });
  localStorage.clear();
  var jio = jIO.newJio({
      "type": "local",
      "username": "Marco",
      "application_name": "Marco_PM"
    }),
    jio_state = jIO.newJio({
      "type": "local",
      "username": "Marco",
      "application_name": "Marco_PM_state"
    }),
    jio_project = jIO.newJio({
      "type": "local",
      "username": "Marco",
      "application_name": "Marco_PM_project"
    }),
    projects = [
      {"_id": "PR-1", "project": "Daily activity"},
      {"_id": "PR-2", "project": "Weekly activity"},
      {"_id": "PR-3", "project": "Weekend activity"}
    ],
    states = [
      { "_id": "ST-1", "state": "started"},
      {"_id": "ST-2", "state": "continues"},
      {"_id": "ST-3", "state": "complete"}
    ],
    tasks = [
      {
        "_id": "T-5444",
        "title": "Jquery mobile learning",
        "project": "Daily activity",
        "begindate": "20/05/2013",
        "enddate": "16/11/2013",
        "state": "continues",
        "description": "some description ..."
      },
      {
        "_id": "T-5446",
        "title": "Create a jQuery Mobile Task Manager",
        "project": "Weekly activity",
        "begindate": "01/06/2013",
        "enddate": "30/06/2013",
        "state": "started",
        "description": "task manager app with JQM"
      },
      {
        "_id": "T-5447",
        "title": "Going to the restaurent",
        "project": "Weekend activity",
        "begindate": "11/07/2013",
        "enddate": "12/07/2013",
        "state": "complete",
        "description": "task on jQuery"
      },
      {
        "_id": "T-5448",
        "title": "Going to shopping",
        "project": "Weekend activity",
        "begindate": "11/07/2013",
        "enddate": "13/08/2013",
        "state": "complete",
        "description": "task on jQuery"
      },
      {
        "_id": "T-5449",
        "title": "Writting test module",
        "project": "Weekly activity",
        "begindate": "15/07/2013",
        "enddate": "30/07/2013",
        "state": "continues",
        "description": "test module for jQuery"
      }
    ];

  function insertprojects(i) {
    jio_project.post(projects[i], function (err, rep) {
      if (i === projects.length - 1) {
        insertstates(0);
      } else {
        setTimeout(function () {
          insertprojects(i + 1);
        });
      }
    });
  }

  function insertstates(j) {
    jio_state.post(states[j], function (err, rep) {
      if (j === states.length - 1) {
        inserttasks(0);
      } else {
        setTimeout(function () {
          insertstates(j + 1);
        });
      }
    });
  }

  function inserttasks(k) {
    jio.post(tasks[k], function (err, rep) {
      if (k === tasks.length - 1) {
        displaytasks();
      } else {
        setTimeout(function () {
          inserttasks(k + 1);
        });
      }
    });
  }

  //insert projects, call insertstate whitch
  // call instertasks whitch call displaytasks
  insertprojects(0);

  function displaytasks() {
    /*********************************************************/
    /****************** interaction for index page *****************/
    /*********************************************************/
    console.log("3: displaytasks running");
    $(document).on("pagebeforeshow.index", "#index", function () {
      console.log("4: pagebeforeshow #index");
      var str = "";
      // button states footer menu
      if ($('.projectbutton').hasClass('ui-btn-active')) {
        $('.projectbutton').removeClass('ui-btn-active');
      }
      if ($('.settingsbutton').hasClass('ui-btn-active')) {
        $('.settingsbutton').removeClass('ui-btn-active');
      }
      $('.tasklistbutton').addClass('ui-btn-active');
      // initial display of tasks

      jio.allDocs(
        { "include_docs": true },
        function (err, response) {
          var i, ftext, current_row;
          for (i = 0; i < response.total_rows; i += 1) {
            current_row = response.rows[i].doc;
            ftext = current_row.title + " " +
              current_row.project + " " +
              current_row.state + " " +
              current_row.begindate + " " +
              current_row.title;
            str += "<li data-filtertext='" + ftext + "'>" +
              "<a class='myLink' data-transition='slide' " +
              " id='" + current_row._id + "' href= 'details.html?_id=" +
              current_row._id + "'>" +
              "<span class='titleSpan'>" + current_row.title + "</span><br/>" +
              "<i>from " + current_row.begindate + "&nbsp;to " +
              current_row.enddate + "</i><br/>" + "<span class='myspan'>" +
              current_row.state + "</span></a></li>";
          }
          $(".content-listview").empty().append(str).listview("refresh");
          $("#sortby").val("#").selectmenu("refresh");
          $(".ui-bar").trigger("create");
        }
      );
    });

    // ===================== element bindings ===========================
    //filtering matching list items on jIO
    $(".content-listview").on("listviewbeforefilter", function (e, data) {
      var query_object = {
        "query": {
          "filter": {
            "limit": [],
            "sort_on": [["title", "ascending"], ["begindate", "ascending"]],
            "select_list": [
              "_id",
              "title",
              "project",
              "begindate",
              "enddate",
              "state"
            ]
          },
          "wildcard_character": '%'
        }
      },
        sort_string,
        timer,
        filterValue,
        val = data.input.value;
      // 500ms delay to allow entering multiple characters
      if (timer) {
        window.clearTimeout(timer);
      }
      if ((filterValue === undefined) || (val !== filterValue)) {
        timer = window.setTimeout(function () {
          timer = null;
          filterValue = val.trim();
          sort_string = "title: = %" + filterValue +
            "% OR project: = %" + filterValue +
            "% OR begindate: = %" +  filterValue +
            "% OR enddate: = %" + filterValue +
            "% OR _id: = %" + filterValue +
            "% OR state: = %" + filterValue + "%";
          //qet query object
          query_object.query.query = sort_string;
          jio.allDocs(
            query_object,
            function (err, response) {
              // console.log(response);
              var i, str = "", ftext, cur_row;
              for (i = 0; i < response.length; i += 1) {
                cur_row = response[i];
                ftext = cur_row.title + " " + cur_row.project + " " +
                  cur_row.state + " " + cur_row.begindate + " " +
                  cur_row.enddate;
                str += "<li data-filtertext='" + ftext + "'>" +
                  "<a class='myLink' id ='" + cur_row._id +
                  "' href='details.html?_id=" + cur_row._id +
                  "'><span class='titleSpan'>" + cur_row.title +
                  "</span><br/><i>from " + cur_row.begindate + "&nbsp;to " +
                  cur_row.enddate + "</i><br/><span class='myspan'>" +
                  cur_row.state + "</span></a></li>";
              }
              $(".content-listview").empty().append(str).listview("refresh");
              $("#sortby").val("#").selectmenu("refresh");
            }
          );
        }, 500);
      }
    });

    // ================ document bindings ====================
    //the listview is reload, based for sort criteria selected
    $("#sortby").change(function (e, data) {
      var criteria = document.getElementById("sortby").value;
      if (criteria === "#") {
        return false;
      }
      jio.allDocs(
        { "query": {
          "query": "_id: = %",
          "filter": {
            "limit": [],
            "sort_on": [[criteria]],
            "select_list": [
              "_id",
              "state",
              "title",
              "project",
              "begindate",
              "enddate"
            ]
          },
          "wildcard_character": '%'
        }
          },
        function (err, response) {
          var i, str = "", ftext, cur_row;
          for (i = 0; i < response.length; i += 1) {
            cur_row = response[i];
            ftext = cur_row.title + " " + cur_row.project + " " +
              cur_row.state + " " + cur_row.begindate + " " + cur_row.enddate;
            str += "<li data-id='" + cur_row._id + "'" +
              " data-filtertext='" + ftext + "'>" +
              "<a class='myLink' data-transition='slide' id='" + cur_row._id +
              "' href= 'details.html?_id=" + cur_row._id + "'>" +
              "<span class='titleSpan'>" + cur_row.title + "</span><br/>" +
              "<i>from " + cur_row.begindate + "&nbsp;to " + cur_row.enddate +
              "</i><br/><span class='myspan'>" + cur_row.state +
              "</span></a></li>";
          }
          $(".content-listview").empty().append(str).listview("refresh");
        }
      );
    });
    // END INDEX

    /***************************************************************/
    /**************** interaction for PROJECT page *****************/
    /***************************************************************/
    $(document).on("pagebeforeshow.projects", "#projects", function () {
      console.log("projects page loaded");
      // button states footer menu
      if ($('.settingsbutton').hasClass('ui-btn-active')) {
        $('.settingsbutton').removeClass('ui-btn-active');
      }
      if ($('.tasklistbutton').hasClass('ui-btn-active')) {
        $('.tasklistbutton').removeClass('ui-btn-active');
      }
      $('.projectbutton').addClass('ui-btn-active');
      // initial display of projects
      jio.allDocs(
        { "query": {
          "query": "_id: = %",
          "filter": {
            "limit": [0, 10],
            "sort_on": [["project", "ascending"]],
            "select_list": [
              "_id",
              "title",
              "description",
              "begindate",
              "enddate",
              "project",
              "state"
            ]
          },
          "wildcard_character": '%'
        }
          },
        function (err, response) {
          var i, k, j, task, str1, str = "", projects = [], reps = response;
          for (i = 0; i < response.length; i += 1) {
            task = response[i];
            if ($.inArray(task.project, projects) === -1) {
              projects.push(task.project); // find if element is in array
            }
          }
          str = "<div data-role='collapsible-set' class='projectgroup' " +
            "data-inset='true'>";
          for (j = 0; j < projects.length; j += 1) {
            str1 = "<div data-role='collapsible' data-theme='c' class='myol' " +
              "data-content-theme='d' class='myol' data-inset='true'><h2>" +
              projects[j] + "</h2><ol data-role='listview' data-inset='true'>";
            for (k = 0; k < reps.length; k += 1) {
              if (reps[k].project === projects[j]) {
                str1 += "<li data-id='" + reps[k]._id + "'><a class='myLink'" +
                  "data-transition='slide' id='" + reps[k]._id + "' " +
                  "href='details.html?_id=" + reps[k]._id + "'>" +
                  "<span class='titleSpan'>" + reps[k].title +
                  "</span><br/><i>from " + reps[k].begindate + "&nbsp;to " +
                  reps[k].enddate + "</i><br/><span class='myspan'>" +
                  reps[k].state + "</span></a></li>";
              }
            }
            str1 += "</ol></div>";
            str += str1;
          }
          str += "</div>";
          $("#pagecontent").empty().append(str).trigger("create");
        }
      );
    });
    // END PROJECT

    /***************************************************************/
    /**************** interaction for SETTINGS page ****************/
    /***************************************************************/
    $(document).on("pagebeforeshow.settings", "#settings", function (e, data) {
      console.log("settings page loaded");
      // button states footer menu
      if ($('.projectbutton').hasClass('ui-btn-active')) {
        $('.projectbutton').removeClass('ui-btn-active');
      }
      if ($('.tasklistbutton').hasClass('ui-btn-active')) {
        $('.tasklistbutton').removeClass('ui-btn-active');
      }
      $('.settingsbutton').addClass('ui-btn-active');

      //get list of existing states
      //  setTimeout(function () {
      jio_state.allDocs(
        { "query": {
          "query": "_id: = %",
          "filter": {
            "limit": [0, 30],
            "sort_on": [["_id", "descending"]],
            "select_list": ["_id", "state"]
          },
          "wildcard_character": '%'
        }
          },
        function (err, response) {
          var i, str = "", cur_row;
          str = "<div data-role='fieldcontain' id='statesset' data-mini='true'>"
            + "<form id='stateform'><fieldset data-role='controlgroup'"
            + " id='statefieldset'><legend>States:</legend>";
          for (i = 0; i < response.length; i += 1) {
            cur_row = response[i];
            str += "<label><input class='costum' name='" + cur_row.state +
              "' id='" + cur_row._id + "' type='checkbox'/>" + cur_row.state +
              "</label>";
          }
          str += "</fieldset><div data-role='controlgroup' " +
            "data-type='horizontal' class='controlsclass' data-mini='true'>" +
            "<a href='#' data-role='button'  class='removestatebutton' " +
            "data-icon='delete' data-iconpos='notext'>Remove</a>" +
            "<a href='#statepopup' data-role='button' class='addstatebutton'" +
            "data-icon='plus' data-position-to='#projectsset' " +
            "data-rel='popup' data-iconpos='notext'>Add</a></div></form></div>";
            // get list of existing projects
          jio_project.allDocs(
            { "query": {
              "query": "_id: = %",
              "filter": {
                "limit": [0, 30],
                "sort_on": [["project", "ascending"]],
                "select_list": ["_id", "project"]
              },
              "wildcard_character": '%'
            }
              },
            function (err, resp) {
              var i, str2 = "";
              // console.log(response[0]._id);
              str2 += "<div data-role='fieldcontain' id='projectsset' " +
                "data-mini='true'><form id='projectform'>" +
                "<fieldset data-role='controlgroup' id='projectfieldset'>" +
                "<legend>Projects:</legend>";
              for (i = 0; i < resp.length; i += 1) {
                str2 += "<label><input type='checkbox' name='" +
                  resp[i].project + "' id='" +  resp[i]._id + "' class='" +
                  resp[i].project + "' />" +  resp[i].project + "</label>";
              }
              str2 += "</fieldset><div data-role='controlgroup' " +
                "data-type='horizontal' class='controlsclass' " +
                "data-mini='true'><a href='#' data-role='button'" +
                "class='removeprojectbutton' data-icon='delete' " +
                "data-theme='a' data-iconpos='notext'>Remove</a>" +
                "<a href='#projectpopup' data-role='button' " +
                "class='addprojectbutton' data-position-to='#statesset'" +
                "data-rel='popup' data-icon='plus' data-iconpos='notext'>" +
                "Add</a></div></form></div>";
              str += str2;
              $("#settingscontent").empty().append(str).trigger("create");
            }
          );
        }
      );
    });

    //Displaying the form to add state
    $(document).on("click", ".addstatebutton", function (e) {
      var str = "<form id='foostate'><label for='state'>State:</label>" +
        "<input type='text' name='state' id='stateid' data-mini='true'/>" +
        "<div data-role='controlgroup' data-type='horizontal' " +
        "data-mini='true'><a data-role='button' class='canceladdstate'" +
        "data-theme='a' href='#' data-icon='delete'>NO</a>&nbsp;&nbsp;" +
        "<a data-role='button' class='confirmaddstate'" +
        " href='#' data-icon='check' data-theme='a'>YES</a></div></form>";
      $("#statepopup").empty().append(str).trigger("create");
    });

    //Removing a state
    $(document).on("click", ".removestatebutton", function (e, data) {
      var i = 0, statetr, st,
        stateToRemove = $('#stateform').serialize().split('&');
      function callback(err, resp) {
        console.log(resp);
        jio_state.remove({"_id": resp[0]._id});
        $("#" + resp[0]._id).parent().remove();
        $('#statefieldset .ui-controlgroup-controls').trigger("create");
      }

      for (i = 0; i < stateToRemove.length; i += 1) {
        statetr = stateToRemove[i].split('=');
        if (statetr[1] === "on") { //the state is checked to be removed
          st = decodeURI(statetr[0].replace(/\+/g, '%20'));
          if (st === "started" || st === "continues" || st === "complete") {
            alert("Unable to remove the default state");
            return false;
          }
          //select the ID of the state to remove in jIO
          jio_state.allDocs(
            { "query": {
              "query": "state: = \"" + st + "\"",
              "filter": {
                "limit": [0, 30],
                "sort_on": [["_id", "descending"]],
                "select_list": ["_id"]
              },
              "wildcard_character": '%'
            }
              },
            callback
          );
        }
      }
      if (stateToRemove[0] === "") {
        alert("no state selected to remove");
      }
    });

    //adding state in jIO and the state form
    $(document).on("click", ".confirmaddstate", function (e, data) {

      var statevalue = $('#foostate').serialize().split('='),
        str,
        state = decodeURI(statevalue[1].replace(/\+/g, '%20'));
      state = state.trim();
      if (!/^[a-z0-9_ ]+$/i.test(state)) {//Check state to match [a-zA-Z _]
        alert("Carractere accepté: [a - z, 0 - 9, A - Z_]");
        return false;
      }
      //Find the last ID for incrementing and assigne to the new state
      jio_state.allDocs(
        { "query": {
          "query": "_id: = %",
          "filter": {
            "limit": [0, 30],
            "sort_on": [["_id", "descending"]],
            "select_list": ["_id", "state"]
          },
          "wildcard_character": '%'
        }
          },
        function (err, resp) {
          var num =  parseInt(resp[0]._id.split('-')[1], 10) + 1,
            key = "ST-" + num,
            i,
            curRow;
          for (i = 0; i < resp.length; i += 1) {
            curRow = resp[i];
            if (curRow.state === state) {
              alert("This state already exist !");
              return null;
            }
          }
          jio_state.post({"_id": key, "state": state });
          str = "<label><input type='checkbox' name='" + state + "' id='" +
            key + "' class='costum'/>" + state + "</label>";
          $('#statefieldset .ui-controlgroup-controls').append(str)
            .parent().parent().trigger("create");
          $("#statepopup").popup("close");
        }
      );
    });

    //closing the adding state panel
    $(document).on("click", ".canceladdstate", function (e, data) {
      $("#statepopup").popup("close");
    });

    //hanDisplaying the popup for adding a project
    $(document).on("click", ".addprojectbutton", function (e) {
      var str = "<form id='fooproject'><label for='project'>Project:</label>" +
        "<input type='text' name='project' id='projectid' data-mini='true' " +
        "value=''/><div data-role='controlgroup' data-type='horizontal' " +
        " data-mini='true'>" +
        "<a data-role='button' class='canceladdproject' data-theme='a' " +
        "href='#' data-icon='delete'>NO</a>&nbsp;&nbsp;" +
        "<a data-role='button' href='#' class='confirmaddproject' " +
        "data-icon='check' data-theme='a'>YES</a></div></form>";
      $("#projectpopup").empty().append(str).trigger("create");
    });

    //removing a project
    $(document).on("click", ".removeprojectbutton", function (e, data) {
      var i, projecttr, pro,
        pro1 = "Daily activity",
        pro2 = "Weekly activity",
        pro3 = "Weekend activity",
        //get the project form fields content
        proToRemove = $('#projectform').serialize().split('&');
      function callback(err, resp) {
        //removing the project in jIO
        jio_project.remove({"_id": resp[0]._id});
        $("#" + resp[0]._id).parent().remove();
        $('#projectfieldset .ui-controlgroup-controls')
                   .trigger("create");
      }
      for (i = 0; i < proToRemove.length; i += 1) {
        projecttr = proToRemove[i].split('=');
        if (projecttr[1] === "on") { //the project is checked to be removed
          pro = decodeURI(projecttr[0].replace(/\+/g, '%20'));
          if (pro === pro1 || pro === pro2 || pro === pro3) { //default states
            alert("Unable to remove the default project");
          } else {
            jio_project.allDocs(
              { "query": {
                "query": "project: = \"" + pro + "\"",
                "filter": {
                  "limit": [0, 30],
                  "sort_on": [["_id", "descending"]],
                  "select_list": ["_id"]
                },
                "wildcard_character": '%'
              }
                },
              callback
            );
          }
        }
      }
      if (proToRemove[0] === "") {
        alert("no project selected to remove");
      }
    });

    //adding a new project injIO and display in the form
    $(document).on("click", ".confirmaddproject", function (e, data) {

      var str, projectvalue = $('#fooproject').serialize().split('='),
        project = decodeURI(projectvalue[1].replace(/\+/g, '%20'));
      project = project.trim();
      //check the project name to match [a-z, A-Z_ ]
      if (!/^[a-z0-9_ ]+$/i.test(project)) {
        alert("Carractere accepté: [a-z, 0-9, A-Z_ ]");
        return false;
      }
      //finding the last ID for incrementing and assign to the new project
      jio_project.allDocs(
        { "query": {
          "query": "_id: = %",
          "filter": {
            "limit": [0, 30],
            "sort_on": [["_id", "descending"]],
            "select_list": ["_id", "project"]
          },
          "wildcard_character": '%'
        }
          },
        function (err, resp) {
          //calculating the new ID
          var num =  parseInt(resp[0]._id.split('-')[1], 10) + 1,
            key = "PR-" + num,
            i,
            curRow;
          for (i = 0; i < resp.length; i += 1) {
            curRow = resp[i];
            if (curRow.project === project) {
              alert("This project already exist !");
              return null;
            }
          }
          jio_project.post({"_id": key, "project": project });
          str = "<label><input type='checkbox' name='" + project +
            "' id='" + key + "' class='costum'/>" + project + "</label>";
          $('#projectfieldset .ui-controlgroup-controls')
            .append(str).parent().parent().trigger("create");
          $("#projectpopup").popup("close");
        }
      );
    });

    $(document).on("click", ".canceladdproject", function (e, data) {
      $("#projectpopup").popup("close");
    });
    // END SETTINGS

    /***************************************************************/
    /**************** interaction for DETAILS page ****************/
    /***************************************************************/
    function validator() {

      var start =  document.getElementById("begindate").value.split('/'),
        end =  document.getElementById("enddate").value.split('/'),
        start1 = new Date(start[1] + "/" + start[0] + "/" + start[2]),
        end1 = new Date(end[1] + "/" + end[0] + "/" + end[2]);
      if (document.getElementById("title").value === "") {
        alert("Title is required");
        return false;
      }
      if (document.getElementById("begindate").value === "") {
        alert("Begin date is required");
        return false;
      }
      if (document.getElementById("enddate").value === "") {
        alert("End date is required");
        return false;
      }
      if (start1 > end1) {
        alert("Uncorresponding dates");
        return false;
      }
      if (document.getElementById("project").value === "#") {
        alert("Please, select a project");
        return false;
      }
      if (document.getElementById("state").value === "#") {
        alert("Please, select a state");
        return false;
      }
      return true;
    }

    $(document).on("pagebeforeshow.details", "#details", function (e, data) {
      console.log("details page loaded");
      var obj = $.mobile.path.parseUrl(location.href),
        ch = obj.search,
        statestr = "",
        projectstr = "";

      // creating states select list
      jio_state.allDocs(
        {"include_docs": true},
        function (err, response) {
          var i;
          statestr = "<select name='state' id='state' data-id ='state' " +
            " data-inline='true' data-mini='true' >" +
            "<option value='#'>-- state --</option>";
          for (i = 0; i < response.total_rows; i += 1) {
            statestr += "<option value='" + response.rows[i].doc.state + "'>" +
              response.rows[i].doc.state + "</option>";
          }
          statestr += "</select>";
          // creating projects select list
          jio_project.allDocs(
            {"include_docs": true},
            function (err, resp) {
              var i, str = "", params, attArray;
              projectstr = "<select name='project' data-id ='project'" +
                " id='project' data-inline='true' data-mini='true'>" +
                "<option value='#'>-- project --</option>";
              for (i = 0; i < resp.total_rows; i += 1) {
                projectstr += "<option value='" + resp.rows[i].doc.project +
                  "'>" + resp.rows[i].doc.project + "</option>";
              }
              projectstr += "</select>";
              if (ch.length === 0) { // New task
                console.log("new task");
                str = "<form><div data-role='fieldcontain' data-mini='true'>" +
                  "<input type='text' id='title' name='title' " +
                  "data-mini='true' placeholder='Title'/>" +
                  "<input type='hidden' id='id' name='id'  value='auto'/>" +
                  "<input name='begindate' id='begindate' " +
                  "data-role='datebox'  placeholder='Begin date' " +
                  "data-options='{\"mode\":\"calbox\", " +
                  "\"useNewStyle\":true}' type='text' data-mini='true'/>" +
                  "<input name='enddate' id='enddate' data-role='datebox'" +
                  " type='text' " +
                  "data-options='{\"mode\":\"calbox\", \"useNewStyle\": " +
                  "true}' data-mini='true'  placeholder='End date'/>" +
                  "<div data-role='fieldcontain' data-mini='true' >" +
                  projectstr + "</div>" +
                  "<div data-role='fieldcontain' data-mini='true' >" +
                  statestr + "</div>" +
                  "<div data-role='fieldcontain' data-mini='true' >" +
                  "<textarea name='description' id='description' " +
                  " data-mini='true' placeholder='description'>" +
                  "</textarea></div><br/>" +
                  "<div data-role='controlgroup' data-type='horizontal' " +
                  "><a href='index.html' data-mini='true' " +
                  "class='deletetaskbutton ui-disabled' data-icon='delete' " +
                  "data-role='button'>" +
                  "Delete</a><a href='index.html' " +
                  "class='savebut' data-mini='true' data-icon='check' " +
                  "data-role='button' >Save</a></div></form>";
                $(".fieldcontain1").empty().append(str).trigger("create");
              } else {//edition task
                console.log("editing task");
                params = ch.split('?')[1];
                attArray = params.split('=');
                jio.allDocs({
                  "query": {
                    "query": "_id: = %" + attArray[1] + "%",
                    "filter": {
                      "limit": [0, 10],
                      "sort_on": [["title", "descending"]],
                      "select_list": [
                        "_id",
                        "title",
                        "project",
                        "begindate",
                        "enddate",
                        "state",
                        "description"
                      ]
                    },
                    "wildcard_character": '%'
                  }
                },
                  function (err, response) {
                    str = "<form><div data-role='fieldcontain'" +
                      " data-mini='true'><label for='title'>Title:</label>" +
                      " <input type='text' id='title' name='title'  value='" +
                      response[0].title + "' data-mini='true' " +
                      " placeholder='Required'/></div>" +
                      "<input type='hidden' name='id' value='" +
                      response[0]._id + "'  id='id'/ >" + //id hidden
                      "<label for='begindate' class='datelabel'>Begin date:" +
                      "</label><input name='begindate' id='begindate'" +
                      " data-role='datebox' placeholder='Required'" +
                      "data-options=" +
                      "'{\"mode\":\"calbox\", \"useNewStyle\":true}' " +
                      " data-mini='true' value='" + response[0].begindate +
                      "' type='text' />" +
                      "<label for='enddate' class='datelabel'>End date:" +
                      "</label><input name='enddate' id='enddate'" +
                      " data-role='datebox' placeholder='Required' " +
                      "data-options=" +
                      "'{\"mode\":\"calbox\", \"useNewStyle\":true}'" +
                      "data-mini='true' value='" + response[0].enddate + "'" +
                      " type='text'/><div data-role='fieldcontain' " +
                      "data-mini='true'><label for='project'>Project:</label>" +
                      projectstr + "</div><div data-role='fieldcontain' " +
                      "data-mini='true'><label for='project'>Project:</label>" +
                      statestr + "</div>" +
                      "<div data-role='fieldcontain' data-mini='true'><label" +
                      " for='description'>Description:</label><textarea " +
                      "name='textarea' id='description' data-mini='true' >" +
                      response[0].description + "</textarea></div><br/>" +
                      "<div data-role='controlgroup' data-type='horizontal'" +
                      "class='cg'><a href='#' data-mini='true'" +
                      " data-rel='back' class='deletetaskbutton'" +
                      " data-icon='delete' data-role='button'>Delete</a>" +
                      "<a href='index.html' class='savebut' " +
                      "data-mini='true' data-icon='check' data-role='button'" +
                      ">Save</a></div></form>";
                    $(".fieldcontain1").empty().append(str).trigger("create");
                    $("#project")
                       .val(response[0].project).selectmenu("refresh");
                    $("#state").val(response[0].state).selectmenu("refresh");
                  });
              }
            }
          );
        }
      );
    });

    //Save edited or new task
    $(document).on("click", ".savebut", function (e, data) {
      e.preventDefault(); // prevent defaul action
      setTimeout(function () {
        if (!validator()) {// stop if no valid field ocur
          return false;
        }
        var object = {};
        object._id = document.getElementById("id").value;
        object.title = document.getElementById("title").value;
        object.project = document.getElementById("project").value;
        object.state = document.getElementById("state").value;
        object.description = document.getElementById("description").value;
        object.begindate = document.getElementById("begindate").value;
        object.enddate = document.getElementById("enddate").value;
			  //alert(object.title);
        if (document.getElementById("id").value === "auto") { //new task
          //create auto increment ID for the new task
          jio.allDocs(
            {"query": {
              "query": "_id: = %",
              "filter": {
                "limit": [0, 10],
                "sort_on": [["_id", "descending"]],
                "select_list": ["_id"]
              },
              "wildcard_character": '%'
            }
              },
            function (err, response) {
              var num = parseInt(response[0]._id.split('-')[1], 10) + 1;
              object._id = "T-" + num;
              jio.put(object);
              document.getElementById("title").value = "";
              $("#project").val("#").selectmenu("refresh");
              $("#state").val("#").selectmenu("refresh");
              document.getElementById("description").value = "";
              document.getElementById("begindate").value = "";
              document.getElementById("enddate").value = "";
            }
          );
        } else { // editing task the ID is in hidden input field
          // console.log(object);
          jio.put(object);
          // console.log(object);
          document.getElementById("title").value = "";
          document.getElementById("description").value = "";
          document.getElementById("begindate").value = "";
          document.getElementById("enddate").value = "";
          $(".savebut").addClass('ui-disabled');
          $(".deletetaskbutton").addClass('ui-disabled');
        }
      }, 50);
    });

    //form removing a given task
    $(document).on("click", ".deletetaskbutton", function (e, data) {
      e.preventDefault();
      if (!validator()) {
        return false;
      }
      var r = confirm("Sure to delete the task " +
        document.getElementById("title").value + "?");
      if (r === true) {
        jio.remove({
          "_id": document.getElementById("id").value
        }, function (err, resp) {
          if (typeof resp === "object") {
            //$.mobile.changePage(document.getElementById("src").value);
            parent.history.back();
          }
        });
      }
      return false;
    });

    $.mobile.initializePage();
  }
}());
