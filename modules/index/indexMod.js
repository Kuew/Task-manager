define([], function (jio, jio_state) {
  "use strict";
  // global variables
  var that = {};
  that.init = function (jio, jio_state) {
    var timer = null,
      filterValue,
      str = "";

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
            current_row.enddate + " " +
            current_row.title;

          str += "<li data-id='" + current_row._id + "'" +
            " data-filtertext='" + ftext + "'>" +
            " <a class='myLink' data-transition='slide' " +
            " id='" + current_row._id +
            "' href= 'details.html?_id=" +  current_row._id + "'>" +
            "<span class='titleSpan'>" + current_row.title + "</span><br/>" +
            "<i>from " + current_row.begindate + "&nbsp;to " +
            current_row.enddate + "</i><br/>" + "<span class='myspan'>" +
            current_row.state + "</span></a><a data-role='button' data-id= '" +
            current_row._id + "' data-position-to='window' " +
            "class='popupbutton' data-rel='popup' " +
            "href='#mypopup' data-icon='gear'></a></li>";
        }
        //console.log("index initialized very well");
        //console.log(err);
        $(".content-listview").empty().append(str).listview("refresh");
      }
    );

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
        val = data.input.value;
      // 500ms delay to allow entering multiple characters
      if (timer) {
        window.clearTimeout(timer);
      }
      if ((filterValue === undefined) || (val !== filterValue)) {
        timer = window.setTimeout(function () {
          timer = null;
          filterValue = val;
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
                str += "<li data-id='" + cur_row._id + "'" +
                  " data-filtertext='" + ftext + "'>" +
                  " <a class='myLink' data-transition='slide' id ='" +
                  cur_row._id + "' href='details.html?_id=" + cur_row._id +
                  "'><span class='titleSpan'>" + cur_row.title +
                  "</span><br/><i>from " + cur_row.begindate + "&nbsp;to " +
                  cur_row.enddate + "</i><br/><span class='myspan'>" +
                  cur_row.state + "</span></a><a data-role='button' " +
                  "data-id= '" + cur_row._id + "' data-position-to='window' " +
                  "class='popupbutton' data-rel='popup' href='#mypopup' " +
                  "data-icon='gear'></a></li>";
              }
              $(".content-listview").empty().append(str).listview("refresh");
            }
          );
        }, 500);
      }
    });

    // ===================== document bindings ===========================
    //displying the popup to change a task state
    $(document).on("click.marco", ".popupbutton", function (e) {

      jio_state.allDocs(
        { "include_docs": true },
        function (err, response) {
          // console.log(response);
          var i, str, cur_row;
          str = "<form id='foo'><label for='select-state' " +
            "class='popupstatelabel'>Select state<select name='select-state'" +
            "data-id ='" + $(e.target).closest("a").attr("data-id") +
            "' id='select-state' data-inline='true' data-mini='true'>" +
            "<option value='#'></option>";
          for (i = 0; i < response.total_rows; i += 1) {
            cur_row = response.rows[i].doc;
            str += "<option value='" + cur_row.state + "'>" + cur_row.state +
              "</option>";
          }
          str += "</select></label>" +
            "<div data-role='controlgroup' data-type='horizontal'>" +
            "<a data-role='button' href='#'  data-rel='back'" +
            "data-mini='true' data-icon='delete'>Cancel</a> &nbsp;&nbsp;" +
            "<a data-role='button' class='confirm' data-icon='check'" +
            "data-mini='true' href='#'>OK</a></div></form>";
          $("#mypopup").empty().append(str).trigger("create");
        }
      );
    });

    // ===================== document bindings ===========================
    //Saving task state choosen from popup menu in jIO and refresh list item
    $(document).on("click", ".confirm", function (e, data) {
      var r;
      if ($(this).attr("data-bound") === undefined) {
        if (!(document.getElementById("select-state").value === "#")) {
          r = confirm("Are you sure, the status of task " +
            document
              .getElementById("select-state")
                .attributes["data-id"].value + " should change to " +
            document.getElementById("select-state").value);
          if (r === true) {
            jio.get(
              {"_id": document
                     .getElementById("select-state")
                        .attributes["data-id"].value },
              function (err, resp) {
                resp.state = document.getElementById("select-state").value;
                jio.put(resp, function (err, response2) {
                  jio.get({"_id": document
                                  .getElementById("select-state")
                                     .attributes["data-id"].value});
                });
                //refresh the task state list item
                $("#" + resp._id).html("<span class='titleSpan'>" +
                  resp.title + "</span><br/><i>from &nbsp;" +
                  resp.begindate + "&nbsp;to&nbsp;" + resp.enddate + "</i>" +
                  "<br/><span span class='myspan'>" + resp.state + "</span>");
                $("#" + resp._id).parent().toggleClass('li-active');
              }
            );
            $("#mypopup").popup("close");
          }
        } else { //no ready to change state, so let's close the popup
          $("#mypopup").popup("close");
        }
      }
      $(this).attr("data-bound", "true");
    });

    // ===================== document bindings ===========================
    //display the sort criterias panel
    $(document).on("click", ".sortbutton", function (e) {
      console.log("Sort button cliqued.........");
      $('taskbutton').addClass('ui-btn-active');
      var str = "";
      str += "<form id='sortform'><fieldset data-role='controlgroup' >" +
        "<legend>Sorting criteria:</legend>" +
        "<input type='radio' data-theme='d' name='sortcriteria' " +
        "data-mini='true' id='title' value='title' checked='checked' />" +
        "<label for='title'>Title</label>" +
        "<input type='radio' data-theme='d' name='sortcriteria' " +
        "data-mini='true' id='state' value='state' />" +
        "<label for='state'> State</label>" +
        "<input type='radio' data-theme='d' name='sortcriteria' " +
        "data-mini='true' id='begindate' value='begindate' />" +
        "<label for='begindate'>Begin date</label>" +
        "<input type='radio' data-theme='d' name='sortcriteria'" +
        "data-mini='true' id='enddate' value='enddate'/>" +
        "<label for='enddate'> Ending date</label></fieldset>" +
        "<fieldset data-role='controlgroup'>" +
        "<legend>Sorting direction</legend>" +
        "<input type='radio' data-theme='d' name='sortdirection' " +
        "data-mini='true' id='ascending' value='ascending' " +
        "checked='checked'/><label for='ascending'> Ascending</label>" +
        "<input type='radio'  id='descending' data-mini='true'" +
        "name='sortdirection' data-theme='d' value='descending'/>" +
        "<label for='descending'> Descending</label></fieldset>" +
        "<fieldset data-role='controlgroup' data-type='horizontal'>" +
        "<a data-role='button' data-rel='back' data-mini='true' " +
        "data-theme='a' href='#' data-icon='delete'>Cancel</a>&nbsp;&nbsp;" +
        "<a data-role='button' class='okbutton' data-icon='check' " +
        "data-mini='true' data-theme='a'>OK</a></fieldset></form>";
      $("#sortpopup").empty().append(str).trigger("create");
    });

    // ===================== document bindings ===========================
    //the listview is reload, based for sort criteria selected
    $(document).on("click", ".okbutton", function (e) {
      var tab = $("#sortform").serialize().split('&'),
        criteria = tab[0].split('='),
        direction = tab[1].split('=');
      jio.allDocs(
        { "query": {
          "query": "_id: = %",
          "filter": {
            "limit": [],
            "sort_on": [[criteria[1], direction[1]]],
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
              "</i><br/><span class='myspan'>" + cur_row.state + "</span></a>" +
              "<a data-role='button' data-id= '" +  cur_row._id + "' " +
              "data-position-to='window' class='popupbutton' data-rel='popup'" +
              "href='#mypopup' data-icon='gear'></a></li>";
          }
          $(".content-listview").empty().append(str).listview("refresh");
        }
      );
    }
      );
  };
  return that;
});
