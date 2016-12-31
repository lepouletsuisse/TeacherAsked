(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:teacherprofileCtrl
	* @description
	* # teacherprofileCtrl
	* Controller of the app
	*/

  	angular
		.module('teacherprofile')
		.controller('TeacherprofileCtrl', Teacherprofile);

		Teacherprofile.$inject = ['$localStorage', '$state','TeacherProfileService', 'toaster'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Teacherprofile($localStorage, $state, TeacherProfileService, toaster) {
			/*jshint validthis: true */
			var vm = this;

			vm.firstname = "";
			vm.lastname = "";
			vm.className = "";
			vm.numberParticipants = "";

			//Check if the user is allow to come on this page
			if($localStorage.token == undefined){
				$state.go('home');
			}

			TeacherProfileService.getTeacher($localStorage.token)
			.then(function(res){
				if(res.status == 200){
					vm.firstname = res.data.firstname;
					vm.lastname = res.data.lastname;
				}else{
					toaster.pop('error', "Teacher", "Token invalid, please log again!");
					$state.go('home');
				}
			});

			vm.createRoom = function(){
				TeacherProfileService.createRoom(vm.className, vm.numberParticipants, $localStorage.token)
				.then(function(res){
					if(res.status == 201){
						toaster.pop("info", "Create room", "Succesfully create room " + res.data.roomConnectionId);
						console.log(res.data);
						$state.go('roomteacher', {roomId: res.data.roomConnectionId});
					}else{
						toaster.pop("error", "Create Room", "Impossible to create the room!");
					}
				})
			}
			
		}

})();
