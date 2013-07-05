define([], function(jio, jio_state, jio_project){
//(function () {
  "use strict";
  // global variables
  var that = {};

  that.init = function (jio, jio_state, jio_project) {
    
    //$(document).on("pagebeforeshow","#settings", function (e, data) {
      
      if( $('.projectbutton').hasClass('ui-btn-active') )
        $('.projectbutton').removeClass('ui-btn-active');
      if( $('.tasklistbutton').hasClass('ui-btn-active') )
        $('.tasklistbutton').removeClass('ui-btn-active');
      $('.settingsbutton').addClass('ui-btn-active');
      
    
      var str = "";
      jio_state.allDocs(
        { "query":{
          "query": "_id: = %",
          "filter": {
            "limit":[0,10],
            "sort_on":[["_id","descending"]],
            "select_list":["_id", "state"]
          },
          "wildcard_character":'%'
        }
        },
        function (err, response) {
          var i, str = "";
          
          str = "<div data-role='fieldcontain' id='statesset' data-mini='true'>"
          + "<form id='stateform'><fieldset data-role='controlgroup' id='statefieldset'>"
          + "<legend>States:</legend>";
          for (i = 0; i < response.length; i++) {
            str += "<label><input type='checkbox' name='" + response[i].state + "' id='" +  response[i]._id + "_' class='costum' />" +  response[i].state + "</label>"
          }
          str += "</fieldset><div data-role='controlgroup' data-type='horizontal' class='controlsclass' data-mini='true'><a href='#' data-role='button'  class='removestatebutton' data-icon='delete' data-theme='a'>Remove</a>"
          +  "<a href='#statepopup' data-role='button' class='addstatebutton' data-icon='add' data-position-to='#projectsset' data-rel='popup'  data-theme='a'>Add</a></div></form></div>";
          ////////
          jio_project.allDocs(
            { "query":{
              "query": "_id: = %",
              "filter": {
                "limit":[0,10],
                "sort_on":[["project","ascending"]],
                "select_list":["_id", "project"]
              },
              "wildcard_character":'%'
            }
            },
            function (err, resp) {
              var i, str2 = "";
              // console.log(response[0]._id);
              str2 += "<div data-role='fieldcontain' id='projectsset' data-mini='true'>"
              + "<form id='projectform'><fieldset data-role='controlgroup' id='projectfieldset'>"
              + "<legend>Projects:</legend>";
              for (i = 0; i < resp.length; i++) {
                str2 += "<label><input type='checkbox' name='" + resp[i].project + "' id='" +  resp[i]._id + "_' class='" +  resp[i].project + "' />" +  resp[i].project + "</label>"
              }
              str2 += "</fieldset><div data-role='controlgroup' data-type='horizontal' class='controlsclass' data-mini='true'><a href='#' data-role='button'  class='removeprojectbutton'  data-icon='delete' data-theme='a'>Remove</a>"
              +  "<a href='#projectpopup' data-role='button'  class='addprojectbutton'  data-icon='add' data-position-to='#statesset' data-rel='popup' data-theme='a'>Add</a></div></form></div>";
              //console.log(str);
              $("#settingscontent").empty().append(str + str2).trigger("create");
            }
          );
        }
      );
    //});
      //handling state popup
      
      $(document).on("click", ".addstatebutton", function (e) {
        //console.log($(e.target).closest("li").text());
            //console.log($(e.target).closest("li").html());
                var str = "<form id='foostate'><label for='state'>State:</label><input type='text' name='state' id='stateid' value='' data-mini='true'/>";
                str += "<div data-role='controlgroup' data-type='horizontal' data-mini='true'><a data-role='button' class='canceladdstate' data-theme='a' href='#' data-icon='delete'>Cancel</a> &nbsp;&nbsp;";
                str += "<a data-role='button'  href='#' class='confirmaddstate' data-icon='check' data-theme='a'>OK</a></div></form>";
                $("#statepopup").empty().append( str).trigger("create");
      });
                
                
                
        $(document).on("click", ".removestatebutton", function (e, data) {
          if ($(this).attr("data-bound") === undefined) {
            var i=0, statetr;
            var statetoremove = $('#stateform').serialize().split('&');
            //console.log(statetoremove);
            for(i=0; i< statetoremove.length; i++){
              statetr = statetoremove[i].split('=');
              if (statetr[1] === "on"){ //the state is checked to be removed
          var state = decodeURI(statetr[0].replace(/\+/g, '%20'));
          if(state === "started" || state === "continues" || state === "complete"){ //default states
            alert("unable to remove the default state");
          }else{
          jio_state.allDocs(
          { "query":{
            //  "query": "state: = %" + state + "%",
             "query": "state: = \"" + state + "\"",
             "filter": {
               "limit":[0,10],
               "sort_on":[["_id","descending"]],
               "select_list":["_id"]
             },
             "wildcard_character":'%'
          }
          },
          function (err, resp) {
            
            jio_state.remove({"_id": resp[0]._id}, function (err, response) {});
            $("#" + resp[0]._id + "_").parent().remove();
            $('#statefieldset .ui-controlgroup-controls').trigger("create");
          }
          );
          }
              }
            }
            if(statetoremove[0] === "")
              alert("no state selected to remove");
          }
        $(this).attr("data-bound", true);
});
  
    $(document).on("click", ".confirmaddstate", function (e, data) {
      if ($(this).attr("data-bound") === undefined) {
      var statevalue = $('#foostate').serialize().split('=');
          var str, state = decodeURI(statevalue[1].replace(/\+/g, '%20'));
          var str;
          ////////
          jio_state.allDocs(
            { "query":{
              "query": "_id: = %",
              "filter": {
                "limit":[0,10],
                "sort_on":[["_id","descending"]],
                "select_list":["_id"]
              },
              "wildcard_character":'%'
            }
    },
    function (err, resp) {
      var num =  parseInt(resp[0]._id.split('-')[1]) +1 ;
      var key = "ST-" + num;
      jio_state.post({"_id": key, "state": state }, function (err, response) {});
          str = "<label><input type='checkbox' name='" + state + "' id='" + key + "_' class='costum'/>" + state + "</label>" ;
          $('#statefieldset .ui-controlgroup-controls').append(str).parent().parent().trigger("create");
            $( "#statepopup" ).popup( "close" );
}
    );
    }
       $(this).attr("data-bound", "true");
      });
      
  $(document).on("click", ".canceladdstate", function (e, data) {
    $( "#statepopup" ).popup( "close" );
  });
        
        
          //handling project popup
            $(document).on("click", ".addprojectbutton", function (e) {
              var str = "<form id='fooproject'><label for='project'>Project:</label><input type='text' name='project' id='projectid' value='' data-mini='true'/>";
              str += "<div data-role='controlgroup' data-type='horizontal'><a data-role='button' class='canceladdproject' data-theme='a' href='#' data-icon='delete'>Cancel</a> &nbsp;&nbsp;";
              str += "<a data-role='button'  href='#' class='confirmaddproject' data-icon='check' data-theme='a'>OK</a></div></form>";
              $("#projectpopup").empty().append( str).trigger("create");
            });
              
              
              $(document).on("click", ".removeprojectbutton", function (e, data) {
                var i = 0 , projecttr;
                var projecttoremove = $('#projectform').serialize().split('&');
                
                for(i=0; i< projecttoremove.length; i++){
                  projecttr = projecttoremove[i].split('=');
                  if (projecttr[1] === "on"){ //the state is checked to be removed
                    var project = decodeURI(projecttr[0].replace(/\+/g, '%20'));
                    if(project === "Daily activity" || project === "Weekly activity" || project === "Weekend activity"){ //default states
                      alert("Unable to remove the default project");
                    }else{
                      //  console.log(project);
                          jio_project.allDocs(
                            { "query":{
                                
                                "query": "project: = \"" + project + "\"",
                                "filter": {
                                  "limit":[0,10],
                                  "sort_on":[["_id","descending"]],
                                  "select_list":["_id"]
                                },
                                "wildcard_character":'%'
                              }
                            },
                            function (err, resp) {
                              jio_project.remove({"_id": resp[0]._id}, function (err, response) {});
                              $("#" + resp[0]._id + "_").parent().remove();
                              $('#projectfieldset .ui-controlgroup-controls').trigger("create");
                            });
                        }
                    }
                  }
                      if(projecttoremove[0] === "")
                        alert("no project selected to remove");
                      });
        
        $(document).on("click", ".confirmaddproject", function (e, data) {
          if ($(this).attr("data-bound") === undefined) {
          var projectvalue = $('#fooproject').serialize().split('=');
          var str, project = decodeURI(projectvalue[1].replace(/\+/g, '%20'));
          jio_project.allDocs(
            { "query":{
                  "query": "_id: = %",
                  "filter": {
                    "limit":[0,10],
                    "sort_on":[["_id","descending"]],
                    "select_list":["_id"]
                  },
                  "wildcard_character":'%'
                }
            },
            function (err, resp) {
              var num =  parseInt(resp[0]._id.split('-')[1]) +1 ;
              var key = "PR-" + num;
              jio_project.post({"_id": key, "project": project }, function (err, response) {});
              str = "<label><input type='checkbox' name='" + project + "' id='" + key + "_' class='costum'/>" + project + "</label>" ;
              $('#projectfieldset .ui-controlgroup-controls').append(str).parent().parent().trigger("create");
                      $( "#projectpopup" ).popup( "close" );
            }
          );
          }
          $(this).attr("data-bound", "true");
        });
              
        $(document).on("click", ".canceladdproject", function (e, data) {
          $( "#projectpopup" ).popup( "close" );
        });
  }
     return that;
});