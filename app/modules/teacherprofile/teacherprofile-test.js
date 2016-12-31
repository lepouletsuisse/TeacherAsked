(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.test:teacherprofileTest
	 * @description
	 * # teacherprofileTest
	 * Test of the app
	 */

	describe('teacherprofile test', function () {
		var controller = null, $scope = null;

		beforeEach(function () {
			module('teacherasked');
		});

		beforeEach(inject(function ($controller, $rootScope) {
			$scope = $rootScope.$new();
			controller = $controller('TeacherprofileCtrl', {
				$scope: $scope
			});
		}));

		it('Should controller must be defined', function () {
			expect(controller).toBeDefined();
		});

	});
})();
