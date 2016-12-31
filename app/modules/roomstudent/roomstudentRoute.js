'use strict';

/**
 * @ngdoc function
 * @name app.route:roomstudentRoute
 * @description
 * # roomstudentRoute
 * Route of the app
 */

angular.module('roomstudent')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('roomstudent', {
				url:'/roomstudent',
				templateUrl: 'app/modules/roomstudent/roomstudent.html',
				controller: 'RoomstudentCtrl',
				controllerAs: 'vm'
			});

		
	}]);
