define([], function (jio, jio_state, jio_project) {
  "use strict";
  // global variables
  var that = {};

  that.populateSettings = function (jio, jio_state, jio_project) {
    // button states footer menu
    if ($('.projectbutton').hasClass('ui-btn-active')) {
      $('.projectbutton').removeClass('ui-btn-active');
    }
    if ($('.tasklistbutton').hasClass('ui-btn-active')) {
      $('.tasklistbutton').removeClass('ui-btn-active');
    }
    $('.settingsbutton').addClass('ui-btn-active');

    //get list of existing states
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
        for (i = 0; i < response.length; i++) {
          cur_row = response[i];
          str += "<label><input class='costum' name='" + cur_row.state +
            "' id='" + cur_row._id + "_' type='checkbox'/>" + cur_row.state +
            "</label>";
        }
        str += "</fieldset><div data-role='controlgroup' " +
          "data-type='horizontal' class='controlsclass' data-mini='true'>" +
          "<a href='#' data-role='button'  class='removestatebutton' " +
          "data-icon='delete' data-theme='a'>Remove</a>" +
          "<a href='#statepopup' data-role='button' class='addstatebutton'" +
          "data-icon='add' data-position-to='#projectsset' data-rel='popup'" +
          "data-theme='a'>Add</a></div></form></div>";
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
            for (i = 0; i < resp.length; i++) {
              str2 += "<label><input type='checkbox' name='" +
                resp[i].project + "' id='" +  resp[i]._id + "_' class='" +
                resp[i].project + "' />" +  resp[i].project + "</label>";
            }
            str2 += "</fieldset><div data-role='controlgroup' " +
              "data-type='horizontal' class='controlsclass' " +
              "data-mini='true'><a href='#' data-role='button'" +
              "class='removeprojectbutton' data-icon='delete' " +
              "data-theme='a'>Remove</a>" +
              "<a href='#projectpopup' data-role='button' " +
              "class='addprojectbutton' data-position-to='#statesset'" +
              "data-rel='popup' data-theme='a' data-icon='add'>Add</a>" +
              "</div></form></div>";
            str += str2;
            $("#settingscontent").empty().append(str).trigger("create");
          }
        );
      }
    );
  };

  that.init = function (jio, jio_state, jio_project) {

    //Displaying the form to add state
    $(document).on("click", ".addstatebutton", function (e) {
      var str = "<form id='foostate'><label for='state'>State:</label>" +
        "<input type='text' name='state' id='stateid' data-mini='true'/>" +
        "<div data-role='controlgroup' data-type='horizontal' " +
        "data-mini='true'><a data-role='button' class='canceladdstate'" +
        "data-theme='a' href='#' data-icon='delete'>Cancel</a>&nbsp;&nbsp;" +
        "<a data-role='button' class='confirmaddstate'" +
        " href='#' data-icon='check' data-theme='a'>OK</a></div></form>";
      $("#statepopup").empty().append(str).trigger("create");
    });

    //Removing a state                   
    $(document).on("click", ".removestatebutton", function (e, data) {
      var i = 0, statetr, st,
        stateToRemove = $('#stateform').serialize().split('&');

      for (i = 0; i < stateToRemove.length; i++) {
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
            function (err, resp) {
              jio_state.remove({"_id": resp[0]._id});
              $("#" + resp[0]._id + "_").parent().remove();
              $('#statefieldset .ui-controlgroup-controls').trigger("create");
            }
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
      if (!/^[a-z_ ]+$/i.test(state)) {//Check state to match [a-zA-Z _]
        alert("Carractere accepté: [a - z, A - Z_]");
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
          for (i = 0; i < resp.length; i++) {
            curRow = resp[i];
            if (curRow.state === state) {
              alert("This state already exist !");
              return null;
            }
          }
          jio_state.post({"_id": key, "state": state });
          str = "<label><input type='checkbox' name='" + state + "' id='" +
            key + "_' class='costum'/>" + state + "</label>";
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
        "value=''/><div data-role='controlgroup' data-type='horizontal'>" +
        "<a data-role='button' class='canceladdproject' data-theme='a' " +
        "href='#' data-icon='delete'>Cancel</a>&nbsp;&nbsp;" +
        "<a data-role='button' href='#' class='confirmaddproject' " +
        "data-icon='check' data-theme='a'>OK</a></div></form>";
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
      for (i = 0; i < proToRemove.length; i++) {
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
              function (err, resp) {
                //removing the project in jIO
                jio_project.remove({"_id": resp[0]._id});
                $("#" + resp[0]._id + "_").parent().remove();
                $('#projectfieldset .ui-controlgroup-controls')
                  .trigger("create");
              }
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
      if (!/^[a-z_ ]+$/i.test(project)) {
        alert("Carractere accepté: [a-z, A-Z_ ]");
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
          for (i = 0; i < resp.length; i++) {
            curRow = resp[i];
            if (curRow.project === project) {
              alert("This project already exist !");
              return null;
            }
          }
          jio_project.post({"_id": key, "project": project });
          str = "<label><input type='checkbox' name='" + project +
            "' id='" + key + "_' class='costum'/>" + project + "</label>";
          $('#projectfieldset .ui-controlgroup-controls')
            .append(str).parent().parent().trigger("create");
          $("#projectpopup").popup("close");
        }
      );
    });
    $(document).on("click", ".canceladdproject", function (e, data) {
      $("#projectpopup").popup("close");
    });
  };
  return that;
});
