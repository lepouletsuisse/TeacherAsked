(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:homeCtrl
	* @description
	* # homeCtrl
	* Controller of the app
	*/

  	angular
		.module('home')
		.controller('HomeCtrl', Home);

		Home.$inject = ['$scope', '$state', 'toaster', 'HomeService', '$localStorage'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Home($scope, $state, toaster, HomeService, $localStorage) {
			/*jshint validthis: true */
			var vm = this;

			$localStorage.token = undefined;

			vm.usernameTeacher = "";
			vm.firstname = "";
			vm.lastname = "";
			vm.password = "";
			vm.usernameStudent = "";
			vm.roomId = "";

			vm.submitLogin = function(){
				HomeService.login(vm.usernameTeacher, vm.password)
				.then(function(res){
					if(res.status == 200){
						toaster.pop('info', "Login", "Successful login! Welcome " + res.data.username);
						$localStorage.token = res.data.token;
						return $state.go('teacherprofile');
					}else if(res.status == 401){
						toaster.pop('error', "Login", res.data);
					}else{
						toaster.pop('error', "Login", "An error occured while connecting to the server!");
					}
				});
			}

			vm.submitRegister = function(){
				HomeService.register(vm.usernameTeacher, vm.password, vm.firstname, vm.lastname)
				.then(function(res){
					if(res.status == 201){
						toaster.pop('info', "Register", "Successful register! You can log in now!");
					}else{
						toaster.pop('error', "Register", res.data);
					}
				});
			}

			vm.submitStudent = function(){
				HomeService.checkRoom(vm.roomId)
				.then(function(resRoom){
					if(resRoom.status == 200){
						HomeService.createStudent(vm.usernameStudent)
						.then(function(resStudent){
							if(resStudent.status == 201){
								$localStorage.token = resStudent.data.token;
								return $state.go('roomstudent', {roomId: resRoom.data.roomId});
								
							}else{
								toaster.pop('error', "Student", resStudent.data);
							}
						});
					}else{
						toaster.pop('error', 'Student', resRoom.data);
					}
				});
				
			}
		}
})();
