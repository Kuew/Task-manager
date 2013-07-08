define([], function (jio, jio_state) {
  "use strict";
  // global variables
  var that = {};
  that.init = function (jio, jio_state) {
    var timer = null, filterValue, query_object, SELECT_TASK_ID, str = "";
    // $(document).on("pagebeforeshow", "#index", function (e, data) {
    if ($('.projectbutton').hasClass('ui-btn-active')) {
      $('.projectbutton').removeClass('ui-btn-active');
    }
    if ($('.settingsbutton').hasClass('ui-btn-active')) {
      $('.settingsbutton').removeClass('ui-btn-active');
    }
    $('.tasklistbutton').addClass('ui-btn-active');
    jio.allDocs(
      { "include_docs": true },
      function (err, response) {
        var i, ftext;
        for (i = 0; i < response.total_rows; i += 1) {
          ftext = response.rows[i].doc.title + " ";
          ftext += response.rows[i].doc.project + " ";
          ftext += response.rows[i].doc.state + " ";
          ftext += response.rows[i].doc.begindate + " ";
          ftext += response.rows[i].doc.enddate;
          str += "<li data-id='" + response.rows[i].doc._id + "'";
          str += " data-filtertext='" + ftext + "'>";
          str += " <a class='myLink' data-transition='slide' ";
          str += "id='" + response.rows[i].doc._id;
          str += "' href= 'details.html?_id=" +  response.rows[i].doc._id;
          str += "'><span class='titleSpan'>";
          str += response.rows[i].doc.title + "</span><br/><i>from ";
          str += response.rows[i].doc.begindate + "&nbsp;to ";
          str += response.rows[i].doc.enddate + "</i><br/>";
          str += "<span class='myspan'>" + response.rows[i].doc.state;
          str += "</span> </a><a data-role='button' data-id= '";
          str += response.rows[i].doc._id;
          str += "' data-position-to='window' ";
          str += "class='popupbutton' data-rel='popup' ";
          str += "href='#mypopup' data-icon='gear'></a></li>";
        }
        $(".content-listview").empty().append(str).listview("refresh");
      }
    );
    //ds jIO on filre les listiems en fct de la valeur du listview filter
    $(".content-listview").on("listviewbeforefilter", function (e, data) {
      var query_object = {
        "query": {
          "filter": {
            "limit": [0, 10],
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
        sort_string, val = data.input.value;
        // 2 sec delay to allow entering multiple characters
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
          query_object.query.query = sort_string;
          jio.allDocs(
            query_object,
            function (err, response) {
             // console.log(response);
              var i, str = "", ftext;
              for (i = 0; i < response.length; i += 1) {
                ftext = response[i].title + " " + response[i].project + " " + response[i].state + " " + response[i].begindate + " " + response[i].enddate;
                str += "<li data-id='" + response[i]._id + "'";
                str += " data-filtertext='" + ftext + "'>";
                str += " <a class='myLink' data-transition='slide' id ='" + response[i]._id + "' href= 'details.html?_id=" +  response[i]._id + "'><span class='titleSpan'>";
                str += response[i].title + "</span><br/><i>from " + response[i].begindate + "&nbsp;to " + response[i].enddate + "</i><br/><span class='myspan'>" + response[i].state;
                str += "</span> </a><a data-role='button' data-id= '" +  response[i]._id + "' data-position-to='window' class='popupbutton' data-rel='popup' href='#mypopup' data-icon='gear'></a></li>";
              }
              $(".content-listview").empty().append(str).listview("refresh");
            }
          );
        }, 500);
      }
    });

    $(document).on("click", ".popupbutton", function (e) {
     
      jio_state.allDocs(
        { "include_docs": true },
        function (err, response) {
          // console.log(response);
          var i, str;
          str = "<form id='foo'><label for='select-state' class='popupstatelabel'>Select status:";
          str += "<select name='select-state' data-id ='" + $(e.target).closest("a").attr("data-id") + "' id='select-state' data-inline='true' data-mini='true'>";
          str += "<option value='#'></option>";
          for (i = 0; i < response.total_rows; i += 1) {
            str += "<option value='" + response.rows[i].doc.state + "'>" + response.rows[i].doc.state + "</option>";
          }
          str += "</select></label>";
          //console.log("rep:  "+str);
          str += "<div data-role='controlgroup' data-type='horizontal'><a data-role='button' href='#' data-icon='delete' data-rel='back' data-mini='true'>Cancel</a> &nbsp;&nbsp;";
          str += "<a data-role='button'  href='#' class='confirm' data-icon='check'  data-mini='true'>Confirm</a></div></form>";
          $("#mypopup").empty().append(str).trigger("create");
        }
      );
      
      
    });

    //On enregistre le nouveau status du projet à partir du popup
    $(document).on("click", ".confirm", function (e, data) {
       if ($(this).attr("data-bound") === undefined) {
      var r;
      if (!(document.getElementById("select-state").value === "#")) {
        r = confirm("Are you sure, the status of task " + document.getElementById("select-state").attributes["data-id"].value + " should change to " + document.getElementById("select-state").value);
        if (r === true) {
          jio.get({"_id": document.getElementById("select-state").attributes["data-id"].value }, function (err, response) {
            response.state = document.getElementById("select-state").value;
            jio.put(response, function (err, response2) {
              jio.get({"_id": document.getElementById("select-state").attributes["data-id"].value}, function (err, response3) {
                //console.log(err);
               // console.log(response);
              });
            });
            $("#" + response._id).html("<span class='titleSpan'>" + response.title + "</span><br/><i>from &nbsp;" + response.begindate + "&nbsp; to &nbsp;" + response.enddate +  "</i><br/><span span class='myspan'>" + response.state + "</span>"); //met a jour le status de la tache dans la liste den selection
            $("#" + response._id).parent().toggleClass('li-active');
            // $("#"+ response._id).addClass("background", "red");
          });
          $("#mypopup").popup("close");
        }
      } else { //il n'a rien selectionné et a cliqué sur le bouton confirm
        $("#mypopup").popup("close");
      }
      }
      $(this).attr("data-bound", "true");
    });

    $(document)
      .on("click", ".sortbutton", function (e) {
        $('taskbutton').addClass('ui-btn-active');
        var  str = "";
        str += "<form id='sortform'><fieldset data-role='controlgroup' ><legend>Sorting criteria:</legend>";
        str += "<input type='radio' data-theme='d' name='sortcriteria' data-mini='true' id='title' value='title' checked='checked' /><label for='title'>Title</label>";
        str += "<input type='radio' data-theme='d' name='sortcriteria' data-mini='true' id='state' value='state' /><label for='state'> State</label>";
        str += "<input type='radio' data-theme='d' name='sortcriteria' data-mini='true' id='begindate' value='begindate' /><label for='begindate'>Begin date</label>";
        str += "<input type='radio' data-theme='d' name='sortcriteria' data-mini='true' id='enddate' value='enddate'/><label for='enddate'> Ending date</label></fieldset>";
        str += "<fieldset data-role='controlgroup'><legend>Sorting direction</legend>";
        str += "<input type='radio' data-theme='d' name='sortdirection' data-mini='true' id='ascending' value='ascending' checked='checked'/><label for='ascending'> Ascending</label>";
        str += "<input type='radio' data-theme='d' name='sortdirection' data-mini='true' id='descending' value='descending'/><label for='descending'> Descending</label></fieldset>";
        str += "<fieldset data-role='controlgroup' data-type='horizontal'><a data-role='button' data-rel='back' data-mini='true' data-theme='a' href='#' data-icon='delete'>Cancel</a> &nbsp;&nbsp;";
        str += "<a data-role='button' class='okbutton' data-icon='check' data-mini='true' data-theme='a'>OK</a></fieldset></form>";
        $("#sortpopup").empty().append(str).trigger("create");
      })
      .on("click", ".okbutton", function (e) {
        var tab = $("#sortform").serialize().split('&'), //for submitting the form and acces to dthe values of fields
          criteria = tab[0].split('='),
          direction = tab[1].split('=');
        jio.allDocs(
          { "query": {
              "query": "_id: = %",
              "filter": {
                "limit": [0, 10],
                "sort_on": [[criteria[1], direction[1]]],
                "select_list": ["_id", "title", "project", "begindate", "enddate", "state"]
              },
              "wildcard_character": '%'
            }
          },

        function (err, response) {
          var i, str = "", ftext;
          for (i = 0; i < response.length; i += 1) {
            ftext = response[i].title +" "+ response[i].project + " " + response[i].state + " " + response[i].begindate + " " + response[i].enddate;
            
            str += "<li data-id='" + response[i]._id + "'";
            str += " data-filtertext='" + ftext + "'>";
            str += " <a class='myLink' data-transition='slide' id='" + response[i]._id + "' href= 'details.html?_id=" +  response[i]._id + "'><span class='titleSpan'>";
            str += response[i].title + "</span><br/><i>from " + response[i].begindate + "&nbsp;to " + response[i].enddate + "</i><br/><span class='myspan'>" + response[i].state;
            str += "</span> </a><a data-role='button' data-id= '" +  response[i]._id + "' data-position-to='window' class='popupbutton' data-rel='popup' href='#mypopup' data-icon='gear'></a></li>";
            
          }
          $(".content-listview").empty().append(str).listview("refresh");
        }
);
});
}
return that;
//}());
});