(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:roomstudentService
	 * @description
	 * # roomstudentService
	 * Service of the app
	 */

  	angular
		.module('roomstudent')
		.factory('RoomstudentService', Roomstudent);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Roomstudent.$inject = ['$http'];

		function Roomstudent ($http) {

		}

})();
