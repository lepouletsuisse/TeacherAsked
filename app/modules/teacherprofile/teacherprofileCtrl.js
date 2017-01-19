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
						$state.go('roomteacher', {roomId: res.data.roomId});
					}else{
						toaster.pop("error", "Create Room", res.data);
					}
				});
			}

			TeacherProfileService.getExistingRoom($localStorage.token)
			.then(function(res){
				if(res.status == 200){
					vm.existingRooms = res.data;
				}else if(res.status == 401){
					console.log(res.data);
				}else{
					console.log(res);
				}
			});

			vm.joinRoom = function(roomId){
				$state.go('roomteacher', {roomId: roomId});
			}
			
		}

})();
