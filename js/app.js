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

function showUserCalendar(userId, apiUrl) {
	// Load template for homepage
	$.ajax({
		url: 'tmpls/homePage.html',
		dataType: 'html',
		type: 'GET',
		async: false,
		cache: false
	}).done(function (html) {
		$('div.container').html(html);
		$('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        defaultView: 'month',
        defaultDate: '2016-03-01'
    })
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
}(jQuery));
