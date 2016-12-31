'use strict';

/**
 * @ngdoc function
 * @name app.route:teacherprofileRoute
 * @description
 * # teacherprofileRoute
 * Route of the app
 */

angular.module('teacherprofile')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('teacherprofile', {
				url:'/teacherprofile',
				templateUrl: 'app/modules/teacherprofile/teacherprofile.html',
				controller: 'TeacherprofileCtrl',
				controllerAs: 'vm'
			});

		
	}]);
