define([], function(jio, jio_state){
  "use strict";
  // global variables
  var that = {};
 
  that.init = function (jio, jio_state) {
   
    var timer = null;
    var filterValue;
    var query_object;
    var  SELECT_TASK_ID;
   
 
 // $(document).on("pagebeforeshow", "#index", function (e, data) {

      if( $('.projectbutton').hasClass('ui-btn-active') )
        $('.projectbutton').removeClass('ui-btn-active');
      if( $('.settingsbutton').hasClass('ui-btn-active') )
        $('.settingsbutton').removeClass('ui-btn-active');
      $('.tasklistbutton').addClass('ui-btn-active');
      
      //$('.tasklistbutton').toggleClass('ui-btn-active');
      //  setTimeout(function () {
      var str = "";
      jio.allDocs(
        { "include_docs": true }, //so to get no only the nID of docs, but all infrmations about

        function (err, response) {
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
  //});    
      
  //on accede à jIO pour filrer les list iems en fonction de la valeur du listview filter
  $( ".content-listview" ).on( "listviewbeforefilter", function ( e, data ) {
    
    var query_object = {
          "query":{
            "filter": {
              "limit":[0,10],
              "sort_on":[["title","ascending"], ["begindate","ascending"]],
              "select_list":["_id", "title", "project", "begindate", "enddate", "state"]
            },
            "wildcard_character":'%'
          }
        };
        var sort_string, val;
        val = data.input.value;
        // 2 sec delay to allow entering multiple characters
        if (timer) {
          window.clearTimeout(timer);
        }

         if( (filterValue === undefined) || (val !== filterValue) ) {
        timer = window.setTimeout(function(){
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
          console.log(response);
          var i, str = "";
          for (i = 0; i < response.length; i += 1) {
              var ftext = response[i].title + " " + response[i].project + " " + response[i].state+ " " + response[i].begindate+ " " + response[i].enddate;
              str += "<li data-id='" + response[i]._id + "'";
              str += " data-filtertext='" + ftext + "'>";
              str += " <a class='myLink' data-transition='slide' id ='" + response[i]._id + "' href= 'details.html?_id=" +  response[i]._id + "'><span class='titleSpan'>";
              str += response[i].title + "</span><br/><i>from " + response[i].begindate + "&nbsp;to " + response[i].enddate + "</i><br/><span class='myspan'>" + response[i].state;
              str += "</span> </a><a data-role='button' data-id= '" +  response[i]._id + "' data-position-to='window' class='popupbutton' data-rel='popup' href='#mypopup' data-icon='gear'></a></li>";
          }
          $(".content-listview").empty().append(str).listview("refresh");
        }
	    );
	  },500);
	};
  });


  $(document).on("click", ".popupbutton", function (e) {

      jio_state.allDocs(
        { "include_docs": true },

        function (err, response) {
          // console.log(response);
          var i;
	  var str = "<form id='foo'><label for='select-state' class='popupstatelabel'>Select status:";
	    str += "<select name='select-state' data-id ='" + $(e.target).closest("a").attr("data-id") + "' id='select-state' data-inline='true' data-mini='true'>";
	    str += "<option value='#'></option>";
	    for (i = 0; i < response.total_rows; i += 1)
	      str += "<option value='" + response.rows[i].doc.state + "'>" + response.rows[i].doc.state + "</option>";
	    str += "</select></label>";
          //console.log("rep:  "+str);
          str += "<div data-role='controlgroup' data-type='horizontal'><a data-role='button' href='#' data-icon='delete' data-rel='back' data-mini='true'>Cancel</a> &nbsp;&nbsp;";
          str += "<a data-role='button'  href='#' class='confirm' data-icon='check'  data-mini='true'>Confirm</a></div></form>";
          $("#mypopup").empty().append( str).trigger("create");
        }
      );
  });

  //On enregistre le nouveau status du projet à partir du popup
  $(document).on( "click",".confirm", function(e, data) {
    var r, tasklistbutton;
    var texte;
    if(!(document.getElementById("select-state").value === "#")){
        r = confirm("Are you sure, the status of task " + document.getElementById("select-state").attributes["data-id"].value + " should change to " + document.getElementById("select-state").value);
        if(r == true){
            jio.get({"_id": document.getElementById("select-state").attributes["data-id"].value }, function (err, response){
                response.state = document.getElementById("select-state").value;
                jio.put(response, function(err, response2){
                  jio.get({"_id": document.getElementById("select-state").attributes["data-id"].value}, function(err, response3){
                    //console.log(response);
                  });
                });
                $("#"+ response._id).html("<span class='titleSpan'>" + response.title + "</span><br/><i>from &nbsp;"+ response.begindate + "&nbsp; to &nbsp;" + response.enddate +  "</i><br/><span span class='myspan'>" + response.state + "</span>"); //met a jour le status de la tache dans la liste den selection
		$("#"+ response._id).parent().toggleClass('li-active');
		// $("#"+ response._id).addClass("background", "red");
	    });
            $( "#mypopup" ).popup( "close" );
        }
        else{ //il n'a pas confirmé a l'alerte
        }
    }else{ //il n'a rien selectionné et a cliqué sur le bouton confirm
        $( "#mypopup" ).popup( "close" );
      }
  });
  
  
  $(document)
  .on("click", ".sortbutton", function (e) {
    $('taskbutton').addClass('ui-btn-active');
    var  str = "";
    str += "<form id='sortform'><fieldset data-role='controlgroup' ><legend>Sorting criteria:</legend>" ;
    str += "<input type='radio' data-theme='d' name='sortcriteria' data-mini='true' id='title' value='title' checked='checked' /><label for='title'>Title</label>";
    str += "<input type='radio' data-theme='d' name='sortcriteria' data-mini='true' id='state' value='state' /><label for='state'> State</label>";
    str += "<input type='radio' data-theme='d' name='sortcriteria' data-mini='true' id='begindate' value='begindate' /><label for='begindate'>Begin date</label>";
    str += "<input type='radio' data-theme='d' name='sortcriteria' data-mini='true' id='enddate' value='enddate'/><label for='enddate'> Ending date</label></fieldset>";
    str += "<fieldset data-role='controlgroup'><legend>Sorting direction</legend>";
    str += "<input type='radio' data-theme='d' name='sortdirection' data-mini='true' id='ascending' value='ascending' checked='checked'/><label for='ascending'> Ascending</label>";
    str += "<input type='radio' data-theme='d' name='sortdirection' data-mini='true' id='descending' value='descending'/><label for='descending'> Descending</label></fieldset>";
    str += "<fieldset data-role='controlgroup' data-type='horizontal'><a data-role='button' data-rel='back' data-mini='true' data-theme='a' href='#' data-icon='delete'>Cancel</a> &nbsp;&nbsp;";
    str += "<a data-role='button' class='okbutton' data-icon='check' data-mini='true' data-theme='a'>OK</a></fieldset></form>";
    $("#sortpopup").empty().append( str).trigger("create");
  })
  .on("click", ".okbutton", function (e) {
    var tab = $("#sortform").serialize().split('&'); //for submitting the form and acces to dthe values of fields
    var criteria = tab[0].split('=');
    var direction = tab[1].split('=');
    
    jio.allDocs(
      { "query":{
	"query": "_id: = %",
	"filter": {
	  "limit":[0,10],
	  "sort_on":[[criteria[1],direction[1]]],
	  "select_list":["_id", "title", "project", "begindate", "enddate", "state"]
      },
      "wildcard_character":'%'
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
  /*
  if ($.mobile.autoInitializePage === false){
    $.mobile.initializePage();
  };*/
  
  /*

    //on reenrégistre le formulaire dans jIO apres modification éventuel de certains champs
    $(document).on( "click",".deletebutton", function(e, data) {

	if(!validator()) return false;
	var r = confirm("Are you sure to delete the task " + document.getElementById("title").value + "?");
        if(r == true) jio.remove({"_id": document.getElementById("id").value}, function (err, response) {});
	return null;
    });



  $(document).on("pagebeforeshow","#projects", function (e, data) {

      // $('.tasklistbutton').toggleClass('ui-btn-active');
      if( $('.settingsbutton').hasClass('ui-btn-active') )
	$('.settingsbutton').removeClass('ui-btn-active');
      if( $('.tasklistbutton').hasClass('ui-btn-active') )
	$('.tasklistbutton').removeClass('ui-btn-active');
      $('.projectbutton').addClass('ui-btn-active');
      setTimeout(function () {
	var str = "";
	jio.allDocs(
	 { "query":{
	      "query": "_id: = %",
	      "filter": {
		  "limit":[0,10],
		  "sort_on":[["project","ascending"]],
		  "select_list":["_id", "title", "description", "begindate", "enddate", "project", "state"]
	      },
	      "wildcard_character":'%'
	    }
	 },
	  function (err, response) {
	    var i, k, j, task, str = "", str1;
	    var projects = [];
	    var reps = response;
	    //console.log(reps);
	    for (i = 0; i < response.length; i++) {
	      task = response[i];
	      if(  $.inArray(task.project, projects) === -1)
		projects.push(task.project);        // find if element is in array
	    }
	    str = "<div data-role='collapsible-set' class='projectgroup' data-inset='true'>";
	    for (j = 0; j < projects.length; j++) {
	        str1 = "<div data-role='collapsible' data-content-theme='d' data-theme='c' class='myol' data-inset='true' ><h2>" + projects[j] + "</h2><ol data-role='listview' data-inset='true' >" ;
	      for(k=0; k< reps.length; k++){
		if(reps[k].project === projects[j]){
		  str1 += "<li data-id='" + reps[k]._id + "' ><a class='myLink' data-transition='slide' id='" + reps[k]._id + "' href= 'details.html?_id=" + reps[k]._id + "'><span class='titleSpan'>"
		      + reps[k].title + "</span><br/><i>from " + reps[k].begindate + "&nbsp;to "
		      + reps[k].enddate + "</i><br/><span class='myspan'>" + reps[k].state + "</span></a></li>";

		}
	      }
	      str1 += " </ol></div>";
	     // console.log(str1);
	      str += str1;
	    }
	    str += "</div>";
	   // console.log(str);
	   $("#pagecontent").empty().append(str).trigger("create");
	  }
	);
      }, 50);
  });

   $(document).on("pagebeforeshow","#settings", function (e, data) {

      if( $('.projectbutton').hasClass('ui-btn-active') )
	$('.projectbutton').removeClass('ui-btn-active');
      if( $('.tasklistbutton').hasClass('ui-btn-active') )
	$('.tasklistbutton').removeClass('ui-btn-active');
      $('.settingsbutton').addClass('ui-btn-active');

    //  console.log("touché");
      setTimeout(function () {

	////
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

	  ////////
	  }
	);
      }, 500);
  });


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
  });

  $(document).on("click", ".confirmaddstate", function (e, data) {
    var statevalue = $('#foostate').serialize().split('=');
    if(statevalue[1] === "") return false;
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
    var i = 0	, projecttr;
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

    var projectvalue = $('#fooproject').serialize().split('=');
    if(projectvalue[1] === "") return false;
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
  });

  $(document).on("click", ".canceladdproject", function (e, data) {
    $( "#projectpopup" ).popup( "close" );
  });

  $(document).on("pagebeforeshow","#details", function (e, data) {

        var obj = $.mobile.path.parseUrl(location.href);
	var ch = obj.search;
	var statestr ="";
	var projectstr = "";
	jio_state.allDocs( // creating states select list
        { "include_docs": true },

	  function (err, response) {
	    var i;
	    statestr = "<div data-role='fieldcontain' data-mini='true'><label for='state'>State:</label>";
	    statestr += "<select name='state' data-id ='state' id='state' data-inline='true' data-mini='true' data-theme='c' >";
	    statestr += "<option value='#'></option>";
	    for (i = 0; i < response.total_rows; i += 1)
	      statestr += "<option value='" + response.rows[i].doc.state + "'>" + response.rows[i].doc.state + "</option>";
	    statestr += "</select></div>";
	    jio_project.allDocs( // creating projects select list
	    { "include_docs": true },

	      function (err, resp) {
		// console.log(response);
		var i;

		projectstr = "<div data-role='fieldcontain' data-mini='true'><label for='project'>Project:</label>";
		projectstr += "<select name='project' data-id ='project' id='project' data-inline='true' data-mini='true' data-theme='c' >";
		projectstr += "<option value='#'></option>";
		for (i = 0; i < resp.total_rows; i += 1)
		  projectstr += "<option value='" + resp.rows[i].doc.project + "'>" + resp.rows[i].doc.project + "</option>";
		projectstr += "</select></div>";
		if(ch.length == 0){
		    var str = "";
		    console.log("new task");
		    str = "<form id='newfoo'><label for='title'>Title:</label><input type='text' id='title' name='title'  value='' data-mini='true' data-theme='c' placeholder='Task title is required'/>";
		    str += "<input type='hidden' id='id' name='id'  value='auto'/>"
		    str += "<label for='begindate' class='datelabel' >Begin date:</label>";
		    str += "<input name='begindate' id='begindate' type='text' data-role='datebox' data-options='{\"mode\":\"calbox\", \"useNewStyle\":true}' data-mini='true' data-theme='c' />";
		    str += "<label for='enddate'  class='datelabel'>End date:</label>";
		    str += "<input name='enddate' id='enddate' type='text' data-role='datebox' data-options='{\"mode\":\"calbox\", \"useNewStyle\":true}' data-mini='true' data-theme='c'/>";
                     //str += "</div>";
		    str += projectstr + statestr ;
		    str += "<label for='description'>Description:</label><textarea name='description' id='description' data-mini='true' data-theme='c'></textarea></form>";
		    $(".fieldcontain1").empty().append( str).trigger("create");
		 //   console.log($("input[name='begindate']").val());
		}else{
		    console.log("editing task");
		    var params, attArray, attName, attValue;
		    params = ch.split('?')[1];
		    attArray = params.split('=');

		    jio.allDocs(

		      { "query":{
			  "query": "_id: = %" + attArray[1] + "%",
			  "filter": {
			      "limit":[0,10],
			      "sort_on":[["title","descending"]],
			      "select_list":["_id", "title", "project", "begindate", "enddate", "state", "description"]
			  },
			  "wildcard_character":'%'
			}
		      },
		      function (err, response) {
			var i;
			var str = "";
			console.log("avant:");
			console.log(response[0]._id);
			str = "<form id='editfoo'><div data-role='fieldcontain' data-mini='true'><label for='title'>Title:</label><input type='text' id='title' name='title'  value='" + response[0].title + "' data-mini='true' data-theme='c' /></div>";
			str += "<input type='hidden' id='id' name='id'  value='" + response[0]._id + "'/>"; //passing id as hidden input just fro manipulations
			str += "<label for='begindate' class='datelabel'>Begin date:</label>";
			str += "<input name='begindate' id='begindate' type='text' data-role='datebox' data-options='{\"mode\":\"calbox\", \"useNewStyle\":true}' data-mini='true'  value='" + response[0].begindate + "' data-theme='c' />";

			str += "<label for='enddate' class='datelabel'>Begin date:</label>";
			str += "<input name='enddate' id='enddate' type='text' data-role='datebox' data-options='{\"mode\":\"calbox\", \"useNewStyle\":true}' data-mini='true'  value='" + response[0].enddate + "' data-theme='c' />";
			str += "<div data-role='fieldcontain' data-mini='true'><label for='state'>State:</label><input type='text' id='state' name='state'  value='" + response[0].state + "'  disabled='true' data-mini='true' data-theme='c' /></div>";
		        str += "<div data-role='fieldcontain' data-mini='true'><label for='project'>Project:</label><input type='text' id='project' name='project'  value='" + response[0].project + "'  disabled='true' data-mini='true' data-theme='c' /></div>";
			//	str += projectstr + statestr ;
			str += "<div data-role='fieldcontain' data-mini='true'><label for='description'>Description:</label><textarea name='textarea' id='description' data-mini='true' >" + response[0].description + "</textarea><\div></form>";
			$(".fieldcontain1").empty().append( str).trigger("create");
		      }
		    );
		  }
	    });
	  });
    });
    //on reenrégistre le formulaire dans jIO apres modification éventuel de certains champs
  $(document).on( "click",".savebutton", function(e, data) {

        e.preventDefault(); //pour bloquer le rechargement de la page
	if(!validator()) return false; // stop the script(return false) il a given field is not wel filled
        var   object = {} ;
	if(document.getElementById("id").value === "auto"){ // on est en train de créer une nouvelle tache on crée automatiqueeent un identifiant par incrémentation
	    jio.allDocs(
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
	      function (err, response) {

		var num =  parseInt(response[0]._id.split('-')[1]) +1 ;
		object["_id"] = "T-" + num;
		object["title"] = document.getElementById("title").value;
                object["project"] = document.getElementById("project").value;
                object["state"] = document.getElementById("state").value;
                object["description"] = document.getElementById("description").value;
	        object["begindate"] = document.getElementById("begindate").value;
	        object["enddate"] = document.getElementById("enddate").value;
                jio.put(object, function(err, response){
                // console.log(response);
                });
	      }
	    );
	}else{ // On édite une tache, l'identifiant est dans un champ caché du formulaire
	  object["_id"] = document.getElementById("id").value;
          object["title"] = document.getElementById("title").value;
          object["project"] = document.getElementById("project").value;
          object["state"] = document.getElementById("state").value;
          object["description"] = document.getElementById("description").value;
	  object["begindate"] = document.getElementById("begindate").value;
	  object["enddate"] = document.getElementById("enddate").value;
          jio.put(object, function(err, response){
           // console.log(response);
          });
	}
      	document.getElementById("title").value = "";
      	document.getElementById("project").value = "";
      	document.getElementById("state").value = "";
      	document.getElementById("description").value = "";
      	document.getElementById("begindate").value = "";
      	document.getElementById("enddate").value = "";
    });

  
*/
  }
  return that;
//}());
});