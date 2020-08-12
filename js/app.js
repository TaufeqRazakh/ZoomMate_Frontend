(function($) {

	"use strict";
	var state ={
		loggedIn: false
	};

	if ($.cookie('ZoomMateToken')) {
		console.log("Your cookie will be validated");
	} else {
		console.log("You are not an authenticated user");
		$.ajax({
			url: 'tmpls/Greeting.html',
			dataType: 'html',
			type: 'GET',
			async: false,
			cache: false
		}).done(function (html) {
			console.log(html);
			$('div.container').html(html);
			// $('#greetingModal').append(html);
			$('#greetingModalButton').click();
		});
	}

	var options = {
		events_source: 'events.json.php',
		view: 'week',
		tmpl_path: 'tmpls/',
		tmpl_cache: false,
		day: '2020-08-11'
	};

	if(state.loggedIn) {
		console.log("before calendar render");
		var calendar = $('#calendar').calendar(options);

		console.log("after calendar render");
	}

}(jQuery));