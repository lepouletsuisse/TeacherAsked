(function() {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.service:teacherprofileService
	 * @description
	 * # teacherprofileService
	 * Service of the app
	 */

  	angular
		.module('teacherprofile')
		.factory('TeacherProfileService', Teacherprofile);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		Teacherprofile.$inject = ['$http'];

		function Teacherprofile ($http) {
			
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

				createRoom: function(className, numberParticipants, token){
					return $http({
						url: apiBaseURL + "/rooms", 
						method: "POST", 
						data: {
							"className": className,
							"numberParticipants": numberParticipants,
							"token": token
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
