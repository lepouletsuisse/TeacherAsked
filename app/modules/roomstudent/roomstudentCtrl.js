(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:roomstudentCtrl
	* @description
	* # roomstudentCtrl
	* Controller of the app
	*/

  	angular
		.module('roomstudent')
		.controller('RoomstudentCtrl', Roomstudent);

		Roomstudent.$inject = [];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Roomstudent() {
			/*jshint validthis: true */
			var vm = this;

		}

})();
