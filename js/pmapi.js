/*jslint unparam: true, maxlen: 80, indent: 2, nomen: true*/
/*global jQuery, window, console, jIO, localStorage, alert, jQuery,
setTimeout, insertstates, insertprojects, inserttasks, displaytasks, define,
document, $, confirm, location, parent*/
(function () {
  "use strict";
  //console.log("1: pmapi file loaded");
  var tasks = new Object(),
    states = new Object(),
    projects = new Object();
  //   jQuery.extend(jQuery.mobile.datebox.prototype.options, {
  //     'overrideDateFormat': '%d/%m/%Y',
  //     'overrideHeaderFormat': '%d/%m/%Y'
  //   });
  //localStorage.clear();
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
    data = [
      [
        {
          "_id": "PR-1",
          "project": "Daily activity"
        },
        {
          "_id": "PR-2",
          "project": "Weekly activity"
        },
        {
          "_id": "PR-3",
          "project": "Weekend activity"
        }
      ],
      [
        {
          "_id": "ST-1",
          "state": "started"
        },
        {
          "_id": "ST-2",
          "state": "continues"
        },
        {
          "_id": "ST-3",
          "state": "complete"
        }
      ],
      [
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
      ]
    ];

  function insertstaffs(i, j) {
    if (j === 0) { //j===0 ==> posting project
      jio_project.post(data[0][i], function (err, rep) {
        if (i === data[0].length - 1) {
          insertstaffs(0, 1);
        } else {
          setTimeout(function () {
            insertstaffs(i + 1, j);
          });
        }
      });
    } else {
      if (j === 1) { //j===0 ==> posting project
        jio_state.post(data[1][i], function (err, rep) {
          if (i === data[1].length - 1) {
            insertstaffs(0, 2);
          } else {
            setTimeout(function () {
              insertstaffs(i + 1, j);
            });
          }
        });
      } else {
        jio.post(data[2][i], function (err, rep) {
          if (i === data[2].length - 1) {
            inittasks();
          } else {
            setTimeout(function () {
              insertstaffs(i + 1, j);
            });
          }
        });
      }
    }
  };

  function inittasks() {
    jio.allDocs({
        "include_docs": true
      },
      function (err, response) {
        tasks = response;
        setTimeout(function () {
          displaytasks();
        });
      }
    );
    jio_state.allDocs({
        "include_docs": true
      },
      function (err, resp) {
        states = resp;
      }
    );
    jio_project.allDocs({
        "include_docs": true
      },
      function (err, rep) {
        projects = rep;
      }
    );
  }
  if (Object.keys(tasks)
    .length === 0) {
    //console.log("memoire vide");
    if (typeof localStorage[
        "jio/localstorage/Marco/Marco_PM/T-5444"] !==
      "string") {
      //console.log("Localstorage vide");
      insertstaffs(0, 0);
    } else {
      inittasks();
    }
  } else {
    displaytasks();
  }

  function savestaffs() {
    var i;
    for (i = 0; i < tasks.rows.length; i++) {
      jio.put(tasks.rows[i].doc);
    }
    for (i = 0; i < states.rows.length; i++) {
      jio_state.put(states.rows[i].doc);
    }
    for (i = 0; i < projects.rows.length; i++) {
      jio_project.put(projects.rows[i].doc);
    }
    //console.log("staffs saved in localstorage");
  }

  function displaytasks() {
    /*********************************************************/
    /************** interaction for index page ***************/
    /*********************************************************/
    console.log("3: displaytasks running");
    $(document)
      .on("pagebeforeshow.index", "#index", function () {
        console.log("4: pagebeforeshow #index");
        var str = "",
          i, ftext;
        // button states footer menu
        if ($('.projectbutton')
          .hasClass('ui-btn-active')) {
          $('.projectbutton')
            .removeClass('ui-btn-active');
        }
        if ($('.settingsbutton')
          .hasClass('ui-btn-active')) {
          $('.settingsbutton')
            .removeClass('ui-btn-active');
        }
        $('.tasklistbutton')
          .addClass('ui-btn-active');
        // initial display of tasks
        for (i = 0; i < tasks.rows.length; i += 1) {
          ftext = tasks.rows[i].doc.title + " " +
            tasks.rows[i].doc.project + " " +
            tasks.rows[i].doc.state + " " +
            tasks.rows[i].doc.begindate + " " +
            tasks.rows[i].doc.title;
          str += "<li data-filtertext='" + ftext + "'>" +
            "<a class='myLink' id='" + tasks.rows[i].doc._id +
            "' href= 'details.html?_id=" + tasks.rows[i].doc._id +
            "'>" +
            "<span class='titleSpan'>" + tasks.rows[i].doc.title +
            "</span><br/>" +
            "<i>from " + tasks.rows[i].doc.begindate +
            "&nbsp;to " +
            tasks.rows[i].doc.enddate + "</i><br/>" +
            "<span class='myspan'>" +
            tasks.rows[i].doc.state + "</span></a></li>";
        }
        $(".content-listview")
          .empty()
          .append(str)
          .listview("refresh");
        $("#sortby")
          .val("#")
          .selectmenu("refresh");
        $(".ui-bar")
          .trigger("create");
      });
    // ===================== element bindings ===========================
    //filtering matching list items on jIO  //comming soon
    /* $(".content-listview").on("listviewbeforefilter", function (e, data) {

      var timer,
        filterValue,
        val = data.input.value,
        rep,
        i,
        str = "",
        ftext;
      // 500ms delay to allow entering multiple characters
      if (timer) {
        window.clearTimeout(timer);
      }
      if ((filterValue === undefined) || (val !== filterValue)) {
        timer = window.setTimeout(function () {
          timer = null;
          filterValue = val.trim();
           rep = [];
           for(i=0; i< tasks.rows.length; i += 1) {
             for( var key in tasks.rows[i].doc ) {
                if( tasks.rows[i].doc[key] === filterValue ){
                    rep.push(tasks.rows[i].doc);
                }
             }
           }
           console.log(rep);
           for (i = 0; i < rep.length; i += 1) {
             ftext = rep[i].title + " " + rep[i].project + " " +
               rep[i].state + " " + rep[i].begindate + " " +
               rep[i].enddate;
             str += "<li data-filtertext='" + ftext + "'>" +
               "<a class='myLink' id ='" + rep[i]._id +
               "' href='details.html?_id=" + rep[i]._id +
               "'><span class='titleSpan'>" + rep[i].title +
               "</span><br/><i>from " + rep[i].begindate + "&nbsp;to " +
               rep[i].enddate + "</i><br/><span class='myspan'>" +
               rep[i].state + "</span></a></li>";
           }
           $(".content-listview").empty().append(str).listview("refresh");
           $("#sortby").val("#").selectmenu("refresh");
           console.log("str:");
           console.log(str);
        }, 500);
      }
    });*/
    // ================ document bindings ====================
    //the listview is reload, based for sort criteria selected
    $("#sortby")
      .change(function (e, data) {
        //  console.log("chage trigerred");
        var criteria = document.getElementById("sortby")
          .value,
          tasksorted = [],
          i,
          str = "",
          ftext;
        switch (criteria) {
        case "#":
          return false;
          break;
        case "title":
          tasks.rows.sort(function (a, b) {
            return (a.doc.title < b.doc.title ? -1 : a.doc.title >
              b.doc.title ?
              1 : 0);
          });
          break;
        case "state":
          tasks.rows.sort(function (a, b) {
            return (a.doc.state < b.doc.state ? -1 : a.doc.state >
              b.doc.state ?
              1 : 0);
          });
          break;
        case "begindate":
          tasks.rows.sort(function (a, b) {
            return (a.doc.begindate < b.doc.begindate ? -1 : a.doc
              .begindate >
              b.doc.begindate ? 1 : 0);
          });
          break;
        case "enddate":
          tasks.rows.sort(function (a, b) {
            return (a.doc.enddate < b.doc.enddate ? -1 : a.doc.enddate >
              b.doc.enddate ? 1 : 0);
          });
          break;
        default:
          return false;
          break;
        }
        for (i = 0; i < tasks.rows.length; i += 1) {
          ftext = tasks.rows[i].doc.title + " " +
            tasks.rows[i].doc.project + " " +
            tasks.rows[i].doc.state + " " +
            tasks.rows[i].doc.begindate + " " +
            tasks.rows[i].doc.enddate;
          str += "<li data-id='" + tasks.rows[i].doc._id + "'" +
            " data-filtertext='" + ftext + "'>" +
            "<a class='myLink' id='" + tasks.rows[i].doc._id +
            "' href= 'details.html?_id=" + tasks.rows[i].doc._id +
            "'>" +
            "<span class='titleSpan'>" + tasks.rows[i].doc.title +
            "</span><br/><i>from " + tasks.rows[i].doc.begindate +
            "&nbsp;to " + tasks.rows[i].doc.enddate +
            "</i><br/><span class='myspan'>" + tasks.rows[i].doc.state +
            "</span></a></li>";
        }
        $(".content-listview")
          .empty()
          .append(str)
          .listview("refresh");
      });
    // END INDEX
    /***************************************************************/
    /**************** interaction for PROJECT page *****************/
    /***************************************************************/
    $(document)
      .on("pagebeforeshow.projects", "#projects", function () {
        ///  console.log("projects page loaded");
        // button states footer menu
        if ($('.settingsbutton')
          .hasClass('ui-btn-active')) {
          $('.settingsbutton')
            .removeClass('ui-btn-active');
        }
        if ($('.tasklistbutton')
          .hasClass('ui-btn-active')) {
          $('.tasklistbutton')
            .removeClass('ui-btn-active');
        }
        $('.projectbutton')
          .addClass('ui-btn-active');
        // initial display of projects
        var i, k, j, task, str1, str = "",
          projects = [];
        for (i = 0; i < tasks.rows.length; i += 1) {
          task = tasks.rows[i].doc;
          if ($.inArray(task.project, projects) === -1) {
            projects.push(task.project); // find if element is in array
          }
        }
        str =
          "<div data-role='collapsible-set' class='projectgroup' " +
          "data-inset='true'>";
        for (j = 0; j < projects.length; j += 1) {
          str1 =
            "<div data-role='collapsible' data-theme='c' class='myol' " +
            "data-content-theme='d' class='myol' data-inset='true'><h2>" +
            projects[j] +
            "</h2><ol data-role='listview' data-inset='true'>";
          for (k = 0; k < tasks.rows.length; k += 1) {
            if (tasks.rows[k].doc.project === projects[j]) {
              str1 += "<li data-id='" + tasks.rows[k].doc._id +
                "'>" +
                "<a class='myLink' id='" + tasks.rows[k].doc._id +
                "' href='details.html?_id=" + tasks.rows[k].doc._id +
                "'>" +
                "<span class='titleSpan'>" + tasks.rows[k].doc.title +
                "</span>" +
                "<br/><i>from " + tasks.rows[k].doc.begindate +
                "&nbsp;to " +
                tasks.rows[k].doc.enddate +
                "</i><br/><span class='myspan'>" +
                tasks.rows[k].doc.state + "</span></a></li>";
            }
          }
          str1 += "</ol></div>";
          str += str1;
        }
        str += "</div>";
        $("#pagecontent")
          .empty()
          .append(str)
          .trigger("create");
      });
    // END PROJECT
    /***************************************************************/
    /**************** interaction for SETTINGS page ****************/
    /***************************************************************/
    $(document)
      .on("pagebeforeshow.settings", "#settings", function (e, data) {
        //  console.log("settings page loaded");
        // button states footer menu
        if ($('.projectbutton')
          .hasClass('ui-btn-active')) {
          $('.projectbutton')
            .removeClass('ui-btn-active');
        }
        if ($('.tasklistbutton')
          .hasClass('ui-btn-active')) {
          $('.tasklistbutton')
            .removeClass('ui-btn-active');
        }
        $('.settingsbutton')
          .addClass('ui-btn-active');
        //get list of existing states
        var i,
          str =
            "<div data-role='fieldcontain' id='statesset' data-mini='true'>" +
            "<form id='stateform'><fieldset data-role='controlgroup'" +
            " id='statefieldset'><legend>States:</legend>",
          str2 =
            "<div data-role='fieldcontain' id='projectsset' " +
            "data-mini='true'><form id='projectform'>" +
            "<fieldset data-role='controlgroup' id='projectfieldset'>" +
            "<legend>Projects:</legend>";
        for (i = 0; i < states.rows.length; i += 1) {
          str += "<label><input class='costum' name='" +
            states.rows[i].doc.state + "' id='" + states.rows[i].doc
            ._id +
            "' type='checkbox'/>" + states.rows[i].doc.state +
            "</label>";
        }
        str += "</fieldset><div data-role='controlgroup' " +
          "data-type='horizontal' class='controlsclass' data-mini='true'>" +
          "<a href='#' data-role='button'  class='removestatebutton' " +
          "data-icon='delete' data-iconpos='notext'>Remove</a>" +
          "<a href='#statepopup' data-role='button' class='addstatebutton'" +
          "data-icon='plus' data-position-to='#projectsset' " +
          "data-rel='popup' data-iconpos='notext'>Add</a></div></form></div>";
        for (i = 0; i < projects.rows.length; i += 1) {
          str2 += "<label><input type='checkbox' name='" +
            projects.rows[i].doc.project + "' id='" +
            projects.rows[i].doc._id + "' class='" +
            projects.rows[i].doc.project + "'/>" +
            projects.rows[i].doc.project + "</label>";
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
        $("#settingscontent")
          .empty()
          .append(str)
          .trigger("create");
      });
    //Displaying the form to add state
    $(document)
      .on("click", ".addstatebutton", function (e) {
        var str =
          "<form id='foostate'><label for='state'>State:</label>" +
          "<input type='text' name='state' id='stateid' data-mini='true'/>" +
          "<div data-role='controlgroup' data-type='horizontal' " +
          "data-mini='true'><a data-role='button' class='canceladdstate'" +
          "data-theme='a' href='#' data-icon='delete' data-iconpos='notext' " +
          "data-mini='true'>NO</a><a data-role='button' class='confirmaddstate'" +
          " data-iconpos='notext' href='#' data-icon='check' data-theme='a' " +
          "data-mini='true'>YES</a></div></form>";
        $("#statepopup")
          .empty()
          .append(str)
          .trigger("create");
        $("#stateid")
          .addClass("ui-focus");
      });
    //Removing a state
    $(document)
      .on("click", ".removestatebutton", function (e, data) {
        var i = 0,
          statetr, st, ok, k,
          stateToRemove = $('#stateform')
            .serialize()
            .split('&');
        for (i = 0; i < stateToRemove.length; i += 1) {
          statetr = stateToRemove[i].split('=');
          if (statetr[1] === "on") { //the state is checked to be removed
            st = decodeURI(statetr[0].replace(/\+/g, '%20'));
            if (st === "started" || st === "continues" || st ===
              "complete") {
              alert("Unable to remove default state");
              $("input[name='" + st + "']")
                .attr("checked", false)
                .checkboxradio("refresh");
              return false;
            }
            k = 0;
            ok = false;
            while (ok === false) {
              if (states.rows[k].doc.state === st) {
                $("#" + states.rows[k].doc._id)
                  .parent()
                  .remove();
                $('#statefieldset .ui-controlgroup-controls')
                  .trigger("create");
                states.rows.splice(k, 1);
                ok = true;
              }
              k += 1;
            }
          }
        }
        if (stateToRemove[0] === "") {
          alert("no state selected to remove");
        }
      });
    //adding state in jIO and the state form
    $(document)
      .on("click", ".confirmaddstate", function (e, data) {
        var statevalue = $('#foostate')
          .serialize()
          .split('='),
          str, key, num, i, object = {},
          state = decodeURI(statevalue[1].replace(/\+/g, '%20'));
        state = state.trim();
        if (!/^[a-z0-9_ ]+$/i.test(state)) { //Check state to match [a-zA-Z _]
          alert("Expected charracters: [a - z, 0 - 9, A - Z_]");
          return false;
        }
        key = states.rows[0].doc._id;
        for (i = 1; i < states.rows.length; i += 1) {
          if (states.rows[i].doc._id > key) {
            key = states.rows[i].doc._id;
          }
        }
        num = parseInt(key.split('-')[1], 10) + 1;
        object._id = "ST-" + num;
        object.state = state;
        for (i = 0; i < states.rows.length; i += 1) {
          if (states.rows[i].doc.state === state) {
            alert("This state exists already !");
            return null;
          }
        }
        // console.log(object._id);
        str = "<label><input type='checkbox' name='" + object.state +
          "' id='" +
          object._id + "' class='costum'/>" + object.state +
          "</label>";
        $('#statefieldset .ui-controlgroup-controls')
          .append(str)
          .parent()
          .parent()
          .trigger("create");
        $("#statepopup")
          .popup("close");
        states.rows.push({
          "value": {},
          "id": object._id,
          "key": object._id,
          "doc": object
        });
      });
    //closing the adding state panel
    $(document)
      .on("click", ".canceladdstate", function (e, data) {
        $("#statepopup")
          .popup("close");
      });
    //Displaying the popup for adding a project
    $(document)
      .on("click", ".addprojectbutton", function (e) {
        var str =
          "<form id='fooproject'><label for='project'>Project:</label>" +
          "<input type='text' name='project' id='projectid' data-mini='true' " +
          "value=''/><div data-role='controlgroup' data-type='horizontal' " +
          " data-mini='true'>" +
          "<a data-role='button' class='canceladdproject' data-theme='a' " +
          "href='#' data-icon='delete' data-iconpos='notext'>NO</a>" +
          "<a data-role='button' href='#' class='confirmaddproject' " +
          "data-icon='check' data-theme='a' data-iconpos='notext'>YES</a>" +
          "</div></form>";
        $("#projectpopup")
          .empty()
          .append(str)
          .trigger("create");
        $("#projectid")
          .addClass("ui-focus");
      });
    //removing a project
    $(document)
      .on("click", ".removeprojectbutton", function (e, data) {
        var i, projecttr, pro, k, ok,
          pro1 = "Daily activity",
          pro2 = "Weekly activity",
          pro3 = "Weekend activity",
          //get the project form fields content
          proToRemove = $('#projectform')
            .serialize()
            .split('&');
        for (i = 0; i < proToRemove.length; i += 1) {
          projecttr = proToRemove[i].split('=');
          if (projecttr[1] === "on") { //the project is checked to be removed
            pro = decodeURI(projecttr[0].replace(/\+/g, '%20'));
            if (pro === "Daily activity" || pro ===
              "Weekly activity" ||
              pro === "Weekend activity") { //default states
              alert("Unable to remove the default project");
              $("input[name='" + pro + "']")
                .attr("checked", false)
                .checkboxradio("refresh");
              return false;
            } else {
              k = 0;
              ok = false;
              while (ok === false) {
                if (projects.rows[k].doc.project === pro) {
                  $("#" + projects.rows[k].doc._id)
                    .parent()
                    .remove();
                  $('#statefieldset .ui-controlgroup-controls')
                    .trigger("create");
                  projects.rows.splice(k, 1);
                  ok = true;
                }
                k += 1;
              }
            }
          }
        }
        if (proToRemove[0] === "") {
          alert("no project selected to remove");
        }
      });
    //adding a new project injIO and display in the form
    $(document)
      .on("click", ".confirmaddproject", function (e, data) {
        var str, projectvalue = $('#fooproject')
            .serialize()
            .split('='),
          key, num, i, object = {},
          project = decodeURI(projectvalue[1].replace(/\+/g,
            '%20'));
        project = project.trim();
        //check the project name to match [a-z, A-Z_ ]
        if (!/^[a-z0-9_ ]+$/i.test(project)) {
          alert("Carractere accepté: [a-z, 0-9, A-Z_ ]");
          return false;
        }
        key = projects.rows[0].doc._id;
        for (i = 1; i < projects.rows.length; i += 1) {
          if (projects.rows[i].doc._id > key) {
            key = projects.rows[i].doc._id;
          }
        }
        var num = parseInt(key.split('-')[1], 10) + 1;
        object._id = "PR-" + num;
        object.project = project;
        for (i = 0; i < projects.rows.length; i += 1) {
          if (projects.rows[i].doc.project === project) {
            alert("This project exists already !");
            return null;
          }
        }
        projects.rows.push({
          "value": {},
          "id": object._id,
          "key": object._id,
          "doc": object
        });
        str = "<label><input type='checkbox' name='" +
          object.project + "' id='" + object._id +
          "' class='costum'/>" +
          object.project + "</label>";
        $('#projectfieldset .ui-controlgroup-controls')
          .append(str)
          .parent()
          .parent()
          .trigger("create");
        $("#projectpopup")
          .popup("close");
      });
    $(document)
      .on("click", ".canceladdproject", function (e, data) {
        $("#projectpopup")
          .popup("close");
      });
    // END SETTINGS
    /***************************************************************/
    /**************** interaction for DETAILS page ****************/
    /***************************************************************/

    function validator() {
      var start = document.getElementById("begindate")
        .value.split('/'),
        end = document.getElementById("enddate")
          .value.split('/'),
        start1 = new Date(start[1] + "/" + start[0] + "/" + start[2]),
        end1 = new Date(end[1] + "/" + end[0] + "/" + end[2]);
      if (document.getElementById("title")
        .value === "") {
        alert("Title is required");
        return false;
      }
      if (document.getElementById("begindate")
        .value === "") {
        alert("Begin date is required");
        return false;
      }
      if (document.getElementById("enddate")
        .value === "") {
        alert("End date is required");
        return false;
      }
      if (start1 > end1) {
        alert("Uncorresponding dates");
        return false;
      }
      if (document.getElementById("project")
        .value === "#") {
        alert("Please, select a project");
        return false;
      }
      if (document.getElementById("state")
        .value === "#") {
        alert("Please, select a state");
        return false;
      }
      return true;
    }
    $(document)
      .on("pagebeforeshow.details", "#details", function (e, data) {
        //   console.log("details page loaded");
        var obj = $.mobile.path.parseUrl(location.href),
          ch = obj.search,
          statestr = "",
          projectstr = "",
          i,
          ok = false,
          rep,
          str = "",
          params,
          attArray;
        statestr =
          "<select name='state' id='state' data-id ='state' " +
          " data-inline='true' data-mini='true' >" +
          "<option value='#'>-- state --</option>";
        for (i = 0; i < states.rows.length; i += 1) {
          statestr += "<option value='" + states.rows[i].doc.state +
            "'>" +
            states.rows[i].doc.state + "</option>";
        }
        statestr += "</select>";
        projectstr = "<select name='project' data-id ='project'" +
          " id='project' data-inline='true' data-mini='true'>" +
          "<option value='#'>-- project --</option>";
        for (i = 0; i < projects.rows.length; i += 1) {
          projectstr += "<option value='" + projects.rows[i].doc.project +
            "'>" + projects.rows[i].doc.project + "</option>";
        }
        projectstr += "</select>";
        if (ch.length === 0) { // New task
          //     console.log("new task");
          str =
            "<form><div data-role='fieldcontain' data-mini='true'>" +
            "<input type='text' id='title' name='title' " +
            "data-mini='true' placeholder='Title'/>" +
            "<input type='hidden' id='id' name='id'  value='auto'/>" +
            "<div data-role='fieldcontain' data-mini='true' class='datediv'><input name='begindate' id='begindate' " +
            "data-role='datebox' placeholder='Begin date' " +
            "data-options='{\"mode\":\"calbox\", " +
            "\"useNewStyle\":true}' type='text' data-mini='true'/></div>" +
            "<div data-role='fieldcontain' data-mini='true' class='datediv'><input name='enddate' id='enddate' data-role='datebox'" +
            " type='text'" +
            "data-options='{\"mode\":\"calbox\", \"useNewStyle\": " +
            "true}' data-mini='true'  placeholder='End date'/>" +
            "</div><div data-role='fieldcontain' data-mini='true' >" +
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
          $(".fieldcontain1")
            .empty()
            .append(str)
            .trigger("create");
        } else { //edition task
          //     console.log("editing task");
          params = ch.split('?')[1];
          attArray = params.split('=');
          i = 0;
          while (ok === false && i < tasks.rows.length) {
            if (tasks.rows[i].doc._id === attArray[1]) {
              rep = tasks.rows[i].doc;
              ok = true;
            }
            i += 1;
          }
          str = "<form><div data-role='fieldcontain'" +
            " data-mini='true'><label for='title'>Title:</label>" +
            " <input type='text' id='title' name='title'  value='" +
            rep.title + "' data-mini='true' " +
            " placeholder='Required'/></div>" +
            "<input type='hidden' name='id' value='" +
            rep._id + "'  id='id'/ >" + //id hidden
          "<div data-role='fieldcontain' data-mini='true' class='datediv'>" +
            "<label for='begindate'>Begin date:" +
            "</label><input name='begindate' id='begindate'" +
            " data-role='datebox' placeholder='Required'" +
            "data-options=" +
            "'{\"mode\":\"calbox\", \"useNewStyle\":true}' " +
            " data-mini='true' value='" + rep.begindate +
            "' type='text'/></div>" +
            "<div data-role='fieldcontain' data-mini='true' class='datediv'>" +
            "<label for='enddate'>End date:" +
            "</label><input name='enddate' id='enddate'" +
            " data-role='datebox' placeholder='Required' " +
            "data-options=" +
            "'{\"mode\":\"calbox\", \"useNewStyle\":true}'" +
            "data-mini='true' value='" + rep.enddate + "'" +
            " type='text'/></div><div data-role='fieldcontain' " +
            "data-mini='true'><label for='project'>Project:</label>" +
            projectstr + "</div><div data-role='fieldcontain' " +
            "data-mini='true'><label for='project'>State:</label>" +
            statestr + "</div>" +
            "<div data-role='fieldcontain' data-mini='true'><label" +
            " for='description'>Description:</label><textarea " +
            "name='textarea' id='description' data-mini='true' >" +
            rep.description + "</textarea></div><br/>" +
            "<div data-role='controlgroup' data-type='horizontal'" +
            "class='cg'><a href='#' data-mini='true'" +
            " data-rel='back' class='deletetaskbutton'" +
            " data-icon='delete' data-role='button'>Delete</a>" +
            "<a href='index.html' class='savebut' " +
            "data-mini='true' data-icon='check' data-role='button'" +
            ">Save</a></div></form>";
          $(".fieldcontain1")
            .empty()
            .append(str)
            .trigger("create");
          $("#project")
            .val(rep.project)
            .selectmenu("refresh");
          $("#state")
            .val(rep.state)
            .selectmenu("refresh");
        }
      });
    //Save edited or new task
    $(document)
      .on("click", ".savebut", function (e, data) {
        e.preventDefault(); // prevent defaul action
        if (!validator()) { // stop if no valid field ocur
          return false;
        }
        var object = {},
          key, i, num, ok;
        object._id = document.getElementById("id")
          .value;
        object.title = document.getElementById("title")
          .value;
        object.project = document.getElementById("project")
          .value;
        object.state = document.getElementById("state")
          .value;
        object.description = document.getElementById(
          "description")
          .value;
        object.begindate = document.getElementById("begindate")
          .value;
        object.enddate = document.getElementById("enddate")
          .value;
        if (document.getElementById("id")
          .value === "auto") { //new task
          key = tasks.rows[0].doc._id;
          for (i = 1; i < tasks.rows.length; i += 1) {
            if (tasks.rows[i].doc._id > key) {
              key = tasks.rows[i].doc._id;
            }
          }
          num = parseInt(key.split('-')[1], 10) + 1;
          object._id = "T-" + num;
          tasks.rows.push({
            "value": {},
            "id": object._id,
            "key": object._id,
            "doc": object
          });
          //    console.log(tasks);
          document.getElementById("title")
            .value = "";
          $("#project")
            .val("#")
            .selectmenu("refresh");
          $("#state")
            .val("#")
            .selectmenu("refresh");
          document.getElementById("description")
            .value = "";
          document.getElementById("begindate")
            .value = "";
          document.getElementById("enddate")
            .value = "";
        } else { // editing task the ID is in hidden input field
          i = 0;
          ok = false;
          while (ok === false) {
            if (tasks.rows[i].doc._id === object._id) {
              tasks.rows[i].doc = object;
              ok = true;
              parent.history.back();
            }
            i += 1;
          }
        }
      });
    //form removing a given task
    $(document)
      .on("click", ".deletetaskbutton", function (e, data) {
        e.preventDefault();
        if (!validator()) {
          return false;
        }
        var r = confirm("Sure to delete the task " +
          document.getElementById("title")
          .value + "?"),
          id = document.getElementById("id")
            .value,
          i,
          ok;
        if (r === true) {
          i = 0;
          ok = false;
          while (ok === false) {
            if (tasks.rows[i].doc._id === id) {
              tasks.rows.splice(i, 1);
              ok = true;
              parent.history.back();
            }
            i += 1;
          }
        }
        return false;
      });
    //form removing a given task
    $(document)
      .on("click", ".logout", function (e, data) {
        savestaffs();
        location.href = "http://www.google.com";
      });
    $(window)
      .on('beforeunload', function () {
        savestaffs();
      });
    console.log("now we init jqm")
    $.mobile.initializePage();
  }
}());
