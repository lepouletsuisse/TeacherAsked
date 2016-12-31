(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.test:roomteacherTest
	 * @description
	 * # roomteacherTest
	 * Test of the app
	 */

	describe('roomteacher test', function () {
		var controller = null, $scope = null;

		beforeEach(function () {
			module('teacherasked');
		});

		beforeEach(inject(function ($controller, $rootScope) {
			$scope = $rootScope.$new();
			controller = $controller('RoomteacherCtrl', {
				$scope: $scope
			});
		}));

		it('Should controller must be defined', function () {
			expect(controller).toBeDefined();
		});

	});
})();
