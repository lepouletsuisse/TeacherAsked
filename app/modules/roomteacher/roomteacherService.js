(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:roomteacherService
	 * @description
	 * # roomteacherService
	 * Service of the app
	 */

  	angular
		.module('roomteacher')
		.factory('RoomteacherService', Roomteacher);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Roomteacher.$inject = ['$http'];

		function Roomteacher ($http) {
			var apiBaseURL = config.ApiBaseURL;

			return {
				//Login
				getTeacher: function(token){
					return $http({
						url: apiBaseURL + "/teachers", 
						method: "GET", 
						params: {
							"token": token
						},
					})
					.then(function(res){
						return res;
					})
					.catch(function(res){
						return res;		
					});
				},
				getRoom: function(roomId){
					return $http({
						url: apiBaseURL + "/rooms", 
						method: "GET", 
						params: {
							"roomId": roomId
						},
					})
					.then(function(res){
						return res;
					})
					.catch(function(res){
						return res;		
					});
				}
			}
		}

})();
