(function () {
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

	function Roomstudent($http) {
		var apiBaseURL = config.ApiBaseURL;

		return {
			getRoom: function (roomId) {
				return $http({
					url: apiBaseURL + "/rooms",
					method: "GET",
					params: {
						"roomId": roomId
					},
				})
					.then(function (res) {
						return res;
					})
					.catch(function (res) {
						return res;
					});
			}
		}

	}

})();
