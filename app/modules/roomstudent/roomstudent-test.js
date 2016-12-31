(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.test:roomstudentTest
	 * @description
	 * # roomstudentTest
	 * Test of the app
	 */

	describe('roomstudent test', function () {
		var controller = null, $scope = null;

		beforeEach(function () {
			module('teacherasked');
		});

		beforeEach(inject(function ($controller, $rootScope) {
			$scope = $rootScope.$new();
			controller = $controller('RoomstudentCtrl', {
				$scope: $scope
			});
		}));

		it('Should controller must be defined', function () {
			expect(controller).toBeDefined();
		});

	});
})();
