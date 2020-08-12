$.auth.configure({
	apiUrl: 'http://localhost:3000',
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
		return resp.data;
	},

	handleAccountUpdateResponse: function(resp) {
		return resp.data;
	},

	handleTokenValidationResponse: function(resp) {
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

function showGreetingForm($) {
	$.ajax({
		url: 'tmpls/Greeting.html',
		dataType: 'html',
		type: 'GET',
		async: false,
		cache: false
	}).done(function (html) {
		$('div.container').html(html);
		$('#greetingModalButton').click();
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
}

(function($) {

	if (state.loggedIn) {
		console.log("Cookies found");
	} else {
		console.log("No cookies found");
		showGreetingForm($);
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