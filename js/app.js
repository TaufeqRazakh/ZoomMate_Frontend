(function($) {

	"use strict";

	// var login = false
	//
	// if (!login)
	// 	$('.container').login()

	var options = {
		events_source: 'events.json.php',
		view: 'week',
		tmpl_path: 'tmpls/',
		tmpl_cache: false,
		day: '2013-03-12'
	};

	var calendar = $('#calendar').calendar(options);


}(jQuery));