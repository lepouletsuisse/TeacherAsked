(function() {
	'use strict';

	/**
	 * @ngdoc index
	 * @name app
	 * @description
	 * # app
	 *
	 * Main modules of the application.
	 */

	angular.module('teacherasked', [
		'ngResource',
		'ngAria',
		'ui.bootstrap',
		'ngMaterial',
		'ngMdIcons',
		'ngCookies',
		'ngAnimate',
		'ngSanitize',
		'ui.router',
		'home',
		'teacherprofile',
		'roomstudent',
		'roomteacher',
		'btford.socket-io',
	]).
	factory('mySocket', function (socketFactory) {
		return socketFactory();
	});

})();
