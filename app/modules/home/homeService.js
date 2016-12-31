(function() {
	'use strict';

	/**
	 * Service of the home
	 */

  	angular
		.module('home')
		.factory('HomeService', HomeService);
		// Inject your dependencies as .$inject = ['$http', 'someSevide'];
		// function Name ($http, someSevide) {...}

		HomeService.$inject = ['$http'];

		function HomeService ($http) {

			var apiBaseURL = config.ApiBaseURL;

			return {
				//Login
				login: function(username, password){
					return $http({
						url: apiBaseURL + "/auth", 
						method: "GET", 
						params: {
							"username": username, 
							"password": password
						},
					})
					.then(function(res){
						return res;
					})
					.catch(function(res){
						return res;		
					});
				},
				//Register
				register: function(username, password, firstname, lastname){
					return $http({
						url: apiBaseURL + "/register", 
						method: "POST", 
						data: {
							"username": username, 
							"password": password,
							"firstname": firstname,
							"lastname": lastname
						},
					})
					.then(function(res){
						return res;
					})
					.catch(function(res){
						return res;		
					});
				},
				//Enter room
				enterRoom: function(username, roomId){
					return true;
				}
			}
		}

})();
