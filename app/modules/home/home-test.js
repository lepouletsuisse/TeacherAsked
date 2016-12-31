(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.test:homeTest
	 * @description
	 * # homeTest
	 * Test of the app
	 */

	describe('home test', function () {
		var controller = null, $scope = null;

		beforeEach(function () {
			module('teacherasked');
		});

		beforeEach(inject(function ($controller, $rootScope) {
			$scope = $rootScope.$new();
			controller = $controller('HomeCtrl', {
				$scope: $scope
			});
		}));

		it('Should controller must be defined', function () {
			expect(controller).toBeDefined();
		});

	});
})();
