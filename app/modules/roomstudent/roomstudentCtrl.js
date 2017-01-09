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

		Roomstudent.$inject = ['$timeout', '$q', '$scope', '$state', '$stateParams', '$localStorage', 'toaster', 'RoomstudentService'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Roomstudent($timeout, $q, $scope, $state, $stateParams, $localStorage, toaster, RoomstudentService) {
			/*jshint validthis: true */
			var vm = this;

			vm.roomId;
			vm.studentUsername;

			var currentRoomId = $stateParams.roomId;
			var student;
			var room;

			if($localStorage.token == undefined){
				toaster.pop('error', "Room Student", 'No token!');
				return $state.go('home');
			}

			var checkRoom = RoomstudentService.getRoom(currentRoomId)
			.then(function(res){
				if(res.status != 200){
					toaster.pop('error', "Room Student", "Room id invalid!");
					//return $state.go('home');
				}else{
					room = res.data;
					vm.roomId = room.roomId;
				}
			});

			var checkStudent = RoomstudentService.getStudent($localStorage.token)
			.then(function(res){
				if(res.status == 200){
					student = res.data;
					vm.studentUsername = student.username;
				}else{
					toaster.pop('error', "Room Student", "Token invalid!");
					return $state.go('home');
				}
			});

			$q.all([checkRoom, checkStudent]).then(function() {
				if(student == undefined || room == undefined) return;
				console.log(room);
				console.log(student);

				var socket = io.connect(config.socketIoURL,{query: 
					"roomId=" + room.roomId + 
					"&token=" + student.token + 
					"&type=student"});

				setupSocket($timeout, socket, toaster);
			});
		}
		function setupSocket($timeout, socket, toaster){

			//Use timeout to let the toaster pop, toaster doesn't show if not
			socket.on('info', function(info){
				console.log(info);
				$timeout(toaster.pop('info', 'From socket', info), 100);
			});

			socket.on('critical_error', function(error){
				console.log(error);
				$timeout(100)
				.then(function(promise){
					toaster.pop('error', 'From socket', error);
					//$state.go('home');
				});
			});

			socket.on('disconnect', function(info){
				$timeout(100)
				.then(function(promise){
					toaster.pop('error', 'From socket', "Disconnected");
					//$state.go('home');
				});
				socket.disconnect();
			});

			socket.emit('student_answer', "This is a student_answer");
		}
})();
