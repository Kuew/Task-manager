define([], function (jio, jio_state, jio_project) {

  "use strict";
  // global variables
  var that = {}, start, end;

  //function for form validation
  that.validator = function () {
    start = new Date(document.getElementById("begindate").value);
    end = new Date(document.getElementById("enddate").value);
    //console.log(document.getElementById("title").value);
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
    if (start > end) {
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
  };

  that.populateDetails = function (jio, jio_state, jio_project) {

    var obj = $.mobile.path.parseUrl(location.href),
      ch = obj.search,
      statestr = "",
      projectstr = "";

    // creating states select list
    jio_state.allDocs({
      "include_docs": true
    },

      function (err, response) {
        var i;
        statestr = "<div data-role='fieldcontain' data-mini='true'>" +
          "<label for='state'>State:</label><select name='state' id='state'" +
          "data-id ='state' data-inline='true' data-mini='true'" +
          " data-theme='c'><option value='#'></option>";
        for (i = 0; i < response.total_rows; i += 1) {
          statestr += "<option value='" + response.rows[i].doc.state + "'>" +
            response.rows[i].doc.state + "</option>";
        }
        statestr += "</select></div>";
        // creating projects select list
        jio_project.allDocs({
          "include_docs": true
        },

          function (err, resp) {
            // console.log(response);
            var i, str = "", params, attArray;

            projectstr = "<div data-role='fieldcontain' data-mini='true'>" +
              "<label for='project'>Project:</label> <select name='project' " +
              "data-id ='project' id='project' data-inline='true' " +
              "data-mini='true' data-theme='c'><option value='#'></option>";
            for (i = 0; i < resp.total_rows; i += 1) {
              projectstr += "<option value='" + resp.rows[i].doc.project +
                "'>" + resp.rows[i].doc.project + "</option>";
            }
            projectstr += "</select></div>";
            if (ch.length === 0) { // New task
              console.log("new task");
              str = "<form id='newfoo'><label for='title'>Title:</label>" +
                "<input type='text' id='title' name='title' data-mini='true'" +
                " data-theme='c' value='' placeholder='Required'/>" +
                "<input type='hidden' id='id' name='id'  value='auto'/>" +
                "<label for='begindate' class='datelabel'>Begin date:</label>" +
                "<input name='begindate' id='begindate' data-role='datebox'" +
                "  placeholder='Required' " +
                "data-options='{\"mode\":\"calbox\", \"useNewStyle\":true}' " +
                "type='text' data-mini='true' data-theme='c'/>" +
                "<label for='enddate'  class='datelabel'>End date:</label>" +
                "<input name='enddate' id='enddate' data-role='datebox'" +
                " type='text' " +
                "data-options='{\"mode\":\"calbox\", \"useNewStyle\":true}' " +
                "data-mini='true' data-theme='c' placeholder='Required'/>" +
                projectstr + statestr +
                "<div data-role='fieldcontain' data-mini='true'>" +
                "<label for='description'>Description:</label>" +
                "<textarea name='description' id='description' " +
                " data-mini='true' data-theme='c'></textarea></div><br/>" +
                "<div data-role='controlgroup' data-type='horizontal' " +
                "class='cg'><a href='index.html' data-mini='true'" +
                " data-theme='a' class='deletetaskbutton' data-icon='delete'" +
                " data-role='button' data-rel='back'>Delete</a>" +
                "<a href='index.html' data-theme='a'" +
                "class='savebutton' data-mini='true' data-icon='check' " +
                "data-role='button' data-rel='back'>Save</a></div></form>";
              $(".fieldcontain1").empty().append(str).trigger("create");
            } else {//edition task
              console.log("editing task");
              params = ch.split('?')[1];
              attArray = params.split('=');

              jio.allDocs(

                {
                  "query": {
                    "query": "_id: = %" + attArray[1] + "%",
                    "filter": {
                      "limit": [0, 10],
                      "sort_on": [
                        ["title", "descending"]
                      ],
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
                  str = "<form id='editfoo'><div data-role='fieldcontain'" +
                    " data-mini='true'><label for='title'>Title:</label>" +
                    " <input type='text' id='title' name='title'  value='" +
                    response[0].title + "' data-mini='true' data-theme='c'" +
                    " placeholder='Required'/></div>" +
                    "<input type='hidden' name='id' value='" +
                    response[0]._id + "'  id='id'/ >" + //id hidden
                    "<label for='begindate' class='datelabel'>Begin date:" +
                    "</label><input name='begindate' id='begindate'" +
                    " data-role='datebox' placeholder='Required'" +
                    "data-options=" +
                    "'{\"mode\":\"calbox\", \"useNewStyle\":true}' " +
                    " data-mini='true' value='" + response[0].begindate +
                    "' type='text' data-theme='c'/>" +
                    "<label for='enddate' class='datelabel'>Begin date:" +
                    "</label><input name='enddate' id='enddate'" +
                    " data-role='datebox' placeholder='Required' " +
                    "data-options=" +
                    "'{\"mode\":\"calbox\", \"useNewStyle\":true}'" +
                    "data-mini='true' value='" + response[0].enddate + "'" +
                    "data-theme='c' type='text'/>" +
                    "<div data-role='fieldcontain' data-mini='true'>" +
                    "<label for='state'>State:</label>" +
                    "<input id='state' type='text' value='" +
                    response[0].state + "'" + "disabled='true'  name='state'" +
                    "data-mini='true' data-theme='c'/></div>" +
                    "<div data-role='fieldcontain' data-mini='true'>" +
                    "<label for='project'>Project:</label>" +
                    "<input id='project' value='" + response[0].project + "'" +
                    "disabled='true' name='project' data-mini='true' " +
                    "data-theme='c' type='text'/>" +
                    "</div><div data-role='fieldcontain' data-mini='true'>" +
                    "<label for='description'>Description:</label><textarea " +
                    "name='textarea' id='description' data-mini='true'>" +
                    response[0].description + "</textarea></div><br/>" +
                    "<div data-role='controlgroup' data-type='horizontal'" +
                    "class='cg'><a href='index.html' data-mini='true'" +
                    "data-theme='a' data-rel='back' class='deletetaskbutton'" +
                    " data-icon='delete' data-role='button'>Delete</a>" +
                    "<a href='index.html' data-theme='a' class='savebutton'" +
                    "data-mini='true' data-icon='check' data-role='button'" +
                    "data-rel='back'>Save</a></div></form>";
                  $(".fieldcontain1").empty().append(str).trigger("create");
                }
              );
            }
          });
      });
  };

  that.init = function (jio, jio_state, jio_project) {

    //Save edited or new task
    $(document).on("click", ".savebutton", function (e, data) {
      e.preventDefault(); // prevent defaul action 
      if (!that.validator()) {// stop if no valid field ocur
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
     //object.enddate = $("#enddate").val();
      //console.log($("#enddate").val());
      //console.log(document.getElementById("enddate").value);
      if (document.getElementById("id").value === "auto") { //new task
        //create auto increment ID for the new task
        jio.allDocs({
          "query": {
            "query": "_id: = %",
            "filter": {
              "limit": [0, 10],
              "sort_on": [
                ["_id", "descending"]
              ],
              "select_list": ["_id"]
            },
            "wildcard_character": '%'
          }
        },
          function (err, response) {
            var num = parseInt(response[0]._id.split('-')[1], 10) + 1;
            object._id = "T-" + num;
            console.log(object);
            jio.put(object, function(error, resp){
              console.log(resp);
              console.log(error);
            });
            document.getElementById("title").value = "";
            document.getElementById("project").value = "";
            document.getElementById("state").value = "";
            document.getElementById("description").value = "";
            document.getElementById("begindate").value = "";
            document.getElementById("enddate").value = "";
          }
          );
      } else { // editing task the ID is in hidden input field
        jio.put(object);
        document.getElementById("title").value = "";
        document.getElementById("project").value = "";
        document.getElementById("state").value = "";
        document.getElementById("description").value = "";
        document.getElementById("begindate").value = "";
        document.getElementById("enddate").value = "";
      }
    });

    //form removing a given task
    $(document).on("click", ".deletetaskbutton", function (e, data) {
      // if ($(this).attr("data-bound") === undefined) {
      if (!that.validator()) {
        return false;
      }
      var r = confirm("Sure to delete the task " +
        document.getElementById("title").value + "?");
      if (r === true) {
        jio.remove({
          "_id": document.getElementById("id").value
        });
        return true;
      }
      return false;
    });
  };
  return that;
});
