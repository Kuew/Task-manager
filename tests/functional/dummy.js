/* dummy test */

(function( $ ){

  module( "Index page tests", {});
  asyncTest( "Application should fire up without any errors", function(){
    expect(5);
    $.testHelper.pageSequence([
      function(){
        $.mobile.changePage( "#index" );
      },

      function() {
				console.log("index testtttttttt");
        var $page = $("#index"),
          taskLen = $(".content-listview li").length;
        //jIO and localstorage enable test;
        ok(typeof jIO !== 'undefined', "jIO is enable");
        ok(typeof localStorage === 'object', "localStorage is enable");
				
        //index page listview test
				ok(taskLen > 0, "some task loaded " + taskLen + " tasks");
        var ppbuttons = $page.find(".popupbutton");
        ok(ppbuttons.length > 0, "popup are defined on " + ppbuttons.length + " lines");

				//sort menu test
        var sortby = $page.find("#sortby"),
          state1,
          state2;
        sortby.val("state").selectmenu("refresh");
        sortby.trigger("change");
        state1 = $("ol li span.myspan").eq(0).text();
        state2 = $("ol li span.myspan").eq(1).text();
        ok(state1 <= state2, "sorting by state correct");

        //popup test
        window.confirm = function(e){//overriding the window confirm event
          return true;
        }
		    $(".popupbutton").eq(0).trigger("click");
        setTimeout(function () {
          $("#select-state").val("started").selectmenu("refresh");
					$(".confirm").trigger("click");
        }, 10); 
				/*	
				ok($("ol li span.myspan").eq(0).text() === "started", "state of first task changed to started");
				console.log($("ol li span.myspan").eq(0).text());
				window.confirm = function(e){
					console.log(e);
					return true;
				}*/
		// ok($("#mypopup").hasClass("ui-popup-active"), "popup open");
		// ok($page.find("mypopup").hasclass("ui-popup-active"), "popup open");
		// console.log(ppbuttons[0].trigger("click"));
	
        start();
      }
    ]);
  });
  //end  index tests

  module( "project page tests", {});
  asyncTest( "Displayed the set of projects with provided tasks", function(){
    expect(4);
    $.testHelper.pageSequence([
      function(){
        $.mobile.changePage( "#projects" );
      },
      function() {
				console.log("project testtttttttt");
        var $page = $("#projects"),
          projectLength = $(".myol").length,
          taskLength = $(".myol").eq(0).find("li").length,
          taskTitle = $(".myol").eq(0).find("li").eq(0)
                        .find("span.titleSpan").eq(0).text();
        //jIO and localstorage enable test;
        ok(typeof jIO !== 'undefined', "jIO is enable");
        ok(typeof localStorage === 'object', "localStorage is enable");
        ok(projectLength > 0, $(".myol").length + " projects found");
        ok(taskLength > 0, "First project > first Task: " + taskTitle);
        start();
      }
    ]);
  });

  module( "settings page tests", {});
  asyncTest( "Displayed the set of projects with provided tasks", function(){
    expect(5);
    $.testHelper.pageSequence([
      function(){
        $.mobile.changePage( "#settings" );
      },
      function() {
				console.log("setting testtttttttt");
        var $page = $("#settings"),
          statLength = $("fieldset#statefieldset.ui-controlgroup")
                           .find("input").length,
          projectLength = $("fieldset#projectfieldset.ui-controlgroup")
                            .find("input").length;
        ok(typeof jIO !== 'undefined', "jIO is enable");
        ok(typeof localStorage === 'object', "localStorage is enable");
        ok(statLength > 0, statLength + " default states found");
        ok(projectLength > 0, projectLength + " default projects found");
        $(".addstatebutton").trigger("click");
        setTimeout(function () {
          $("#statepopup input").eq(0).val("test_state2");
          $(".confirmaddstate").trigger("click");
        }, 10);
        console.log($("#statefieldset input").length);
        ok($("#statefieldset input").length > statLength, "new state added to checkbox list");
        
        start();
      }
    ]);
  });

  module( "details page tests", {});
  asyncTest( "Displayed the form form for editting or creating task", function(){
    expect(4);
    $.testHelper.pageSequence([
      function(){
        $.mobile.changePage( "#details" );
      },
      function() {
        console.log("details testtttttttt");
        var $page = $("#details");
        ok(typeof jIO !== 'undefined', "jIO is enable");
        ok(typeof localStorage === 'object', "localStorage is enable");

        var id = $("#id"),
          projects = $("select#project").find("option").length,
          states = $("select#state").find("option").length;
					ok(projects > 1, projects + " projects loaded in select menu");
        ok(states > 1, states + " states select menu");
        start();
      }
    ]);
  });
})(jQuery);
