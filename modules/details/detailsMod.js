define([], function(jio, jio_state, jio_project){
//(function () {
  "use strict";
  // global variables
  var that = {};

  that.init = function (jio, jio_state,  jio_project) {

    function validator (){
     //console.log(document.getElementById("title").value);
    if(document.getElementById("title").value === "" ){
	$("#title").attr('placeholder', 'THIS FIELD IS MANDATORY');
	$("#title").parent().toggleClass( "required");

	return false;
    }

     if(document.getElementById("begindate").value === "" ){
	$("#begindate").attr('placeholder', 'THIS FIELD IS MANDATORY');
	$("#begindate").parent().toggleClass( "required");
	return false;
    }
    if(document.getElementById("enddate").value === "" ){
	$("#enddate").attr('placeholder', 'THIS FIELD IS MANDATORY');
	$("#enddate").parent().toggleClass( "required");
	return false;
    }
    else{
      var start = new Date(document.getElementById("begindate").value);
      var end = new Date(document.getElementById("enddate").value);
      //console.log(start);
      //console.log(end);
      if(start > end){
	$("#enddate").attr('placeholder', 'uncorresponding dates');
	$("#enddate").parent().addClass( "required");
	return false;
      }
    }
    if(document.getElementById("project").value === "#" ){
	alert("Please, select a project");
	return false;
    }
     if(document.getElementById("state").value === "#" ){
	alert("Please, select a state");
	return false;
    }
     if(document.getElementById("description").value === "" ){
	$("#description").attr('placeholder', 'THIS FIELD IS MANDATORY');
	$("#description").toggleClass( "required");
	return false;
    }
    return true;
  };

  //  $(document).on("pagebeforeshow", "#details", function (e, data) {
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
 //});

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

    //on reenrégistre le formulaire dans jIO apres modification éventuel de certains champs
    $(document).on( "click",".deletebutton", function(e, data) {

	if(!validator()) return false;
	var r = confirm("Are you sure to delete the task " + document.getElementById("title").value + "?");
        if(r == true) jio.remove({"_id": document.getElementById("id").value}, function (err, response) {});
	return null;
    });



  }
  return that;
});