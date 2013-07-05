define([], function (jio, jio_state, jio_project) {
  //(function () {
  "use strict";
  // global variables
  var that = {};
  that.init = function (jio, jio_state) {
    // $(document).on("pagebeforeshow","#projects", function (e, data) {
  if ($('.settingsbutton').hasClass('ui-btn-active')) {
    $('.settingsbutton').removeClass('ui-btn-active');
  }
      if ($('.tasklistbutton').hasClass('ui-btn-active')) {
      $('.tasklistbutton').removeClass('ui-btn-active');
      }
      $('.projectbutton').addClass('ui-btn-active');
  jio.allDocs(
    { "query": {
      "query": "_id: = %",
      "filter": {
        "limit": [0, 10],
        "sort_on": [["project", "ascending"]],
        "select_list": ["_id", "title", "description", "begindate", "enddate", "project", "state"]
      },
      "wildcard_character": '%'
    }
    },
    function (err, response) {
      var i, k, j, task, str1, str = "", projects = [], reps = response;
      for (i = 0; i < response.length; i++) {
        task = response[i];
        if ($.inArray(task.project, projects) === -1) {
          projects.push(task.project); // find if element is in array
        }
      }
      str = "<div data-role='collapsible-set' class='projectgroup' data-inset='true'>";
      for (j = 0; j < projects.length; j++) {
          str1 = "<div data-role='collapsible' data-content-theme='d' data-theme='c' class='myol' data-inset='true' ><h2>" + projects[j] + "</h2><ol data-role='listview' data-inset='true' >";
           for (k = 0; k < reps.length; k++) {
             if(reps[k].project === projects[j]){
               str1 += "<li data-id='" + reps[k]._id + "' ><a class='myLink' data-transition='slide' id='" + reps[k]._id + "' href= 'details.html?_id=" + reps[k]._id + "'><span class='titleSpan'>"
               + reps[k].title + "</span><br/><i>from " + reps[k].begindate + "&nbsp;to "
               + reps[k].enddate + "</i><br/><span class='myspan'>" + reps[k].state + "</span></a></li>";
             }
            }
           str1 += " </ol></div>";
           str += str1;
      }  
      str += "</div>";
      // console.log(str);
      $("#pagecontent").empty().append(str).trigger("create");
    }
);
  }
        return that;
});