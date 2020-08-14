var userSession = {
	apiUrl: 'https://zmate.herokuapp.com',
	id: 999,
	goToHomepage : function () {
		$('dismissGreetingModalButton').click();
		$('body').removeClass('modal-open');
		$('div.modal-backdrop').remove();
		$('div.modal-class').remove();
		showUserCalendar(this.id, this.apiUrl);
	}
};

$.auth.configure({
	apiUrl: 'https://zmate.herokuapp.com',
	// apiUrl: 'http://localhost:300',
	signOutPath:           '/auth/sign_out',
	emailSignInPath:       '/auth/sign_in',
	emailRegistrationPath: '/auth',
	accountUpdatePath:     '/auth',
	accountDeletePath:     '/auth',
	passwordResetPath:     '/auth/password',
	passwordUpdatePath:    '/auth/password',
	tokenValidationPath:   '/auth/validate_token',
	proxyIf:               function() { return false; },
	proxyUrl:              '/proxy',
	validateOnPageLoad:    false,
	forceHardRedirect:     false,
	storage:               'cookies',
	cookieExpiry:          14,
	cookiePath:            '/',

	passwordResetSuccessUrl: function() {
		return window.location.href;
	},

	confirmationSuccessUrl:  function() {
		console.log("Returned from confirmation success");
		return window.location.href;
	},

	tokenFormat: {
		"access-token": "{{ access-token }}",
		client:         "{{ client }}",
		expiry:         "{{ expiry }}",
		uid:            "{{ uid }}"
	},

	parseExpiry: function(headers){
		// convert from ruby time (seconds) to js time (millis)
		return (parseInt(headers['expiry'], 10) * 1000) || null;
	},

	handleLoginResponse: function(resp) {
		console.log("Inside handle Login function");
		console.log(resp);
		$.extend(userSession, resp.data);
		userSession.goToHomepage();
		return resp.data;
	},

	handleAccountUpdateResponse: function(resp) {
		console.log("Inside handle Update function");
		return resp.data;
	},

	handleTokenValidationResponse: function(resp) {
		console.log("Inside handle Valid Token function");
		return resp.data;
	},

	authProviderPaths: {
		github:    '/auth/github',
		facebook:  '/auth/facebook',
		google:    '/auth/google_oauth2'
	}
});

"use strict";
var state ={
	loggedIn: false,
	pastAttempt: false
};

function showGreetingForm() {
	$.ajax({
		url: 'tmpls/greeting.html',
		dataType: 'html',
		type: 'GET',
		async: false,
		cache: false
	}).done(function (html) {
		$('div.container').html(html);
		$('#openGreetingModalButton').click();
	});
}

var options = {
	// events_source: 'events.json.php',
	events_source: [
		{
			"id": "293",
			"title": "Lecture CS596",
			"url": "http://www.example.com/",
			"class": "event-warning",
			"start": "1597098600000",
			"end":   "1597102200000"
		},

		{
			"id": "393",
			"title": "Lecture CS455",
			"url": "http://www.example.com/",
			"class": "event-warning",
			"start": "1597249800000",
			"end":   "1597253400000"
		},

		{
			"id": "294",
			"title": "Lecture CS596",
			"url": "http://www.example.com/",
			"class": "event-warning",
			"start": "1597271400000",
			"end":   "1597275000000"
		},

		{
			"id": "394",
			"title": "Lecture CS455",
			"url": "http://www.example.com/",
			"class": "event-warning",
			"start": "1597336200000",
			"end":   "1597339800000"
		},

		{
			"id": "290",
			"title": "Office Hours CS596",
			"url": "http://www.example.com/",
			"class": "event-info",
			"start": "1597473000000",
			"end":   "1597455000000"
		},

		{
			"id": "390",
			"title": "Office Hours CS455",
			"url": "http://www.example.com/",
			"class": "event-info",
			"start": "1597473000000",
			"end":   "1597455000000"
		}
	],
	view: 'week',
	tmpl_path: 'tmpls/',
	tmpl_cache: false,
	day: '2020-08-11'
};

function showUserCalendar(userId, apiUrl) {
	// Load template for calendar
	$.ajax({
		url: 'tmpls/homePage.html',
		dataType: 'html',
		type: 'GET',
		async: false,
		cache: false
	}).done(function (html) {
		$('div.container').html(html);

		console.log('about to get classes for user to place into calendar', userId);
		// $.ajax({
		// 	url: apiUrl + '/courses' + userId + '/enroll',
		// 	dataType: 'json',
		// 	type: 'POST',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	data: {'user_id': userId},
		// 	async: 'false',
		// 	cache: 'true',
		// }).done(function (json) {
		// 	options.events_source = json;
			$('#calendar').calendar(options);
			showAvailableRooms();
		// });

	}).fail(function () {
		showGreetingForm();
	});
}

function showAvailableRooms() {
	// Load template for card

	var t = {};
	var roomData = {};
	roomData.capacity = 7;
	roomData.occupants = 2;
	roomData.url = "https://example.com";
	roomData.purpose = "Informal group Study";
	roomData.courseId = "Combinatorial Logic";
	var allRoomData = [roomData, roomData];
	t.allRoomData = allRoomData;

	$.ajax({
		url: 'tmpls/roomCards.html',
		dataType: 'html',
		type: 'GET',
		async: false,
		cache: false
	}).done(function (html) {
		$('div#rooms').html(_.template(html)(t));
	});
}

function submitSignInForm() {
	const inputs = $('#signInForm').serializeArray();
	console.log(inputs);
	$.auth.emailSignIn({
		email: inputs[0]['value'],
		password: inputs[1]['value']
	});
}

function submitSignUpForm() {
	const inputs = $('#signUpForm').serializeArray();
	console.log(inputs[0]['value'], inputs[1]['value']);
	$.auth.emailSignUp({
		email: inputs[0]['value'],
		password: inputs[1]['value'],
		password_confirmation: inputs[2]['value']
	});
}

function signOut() {
	$.auth.signOut();
	showGreetingForm();
}

(function($) {

	if (state.loggedIn) {
		console.log("Cookies found");
	} else {
		console.log("No cookies found");
		showGreetingForm();
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