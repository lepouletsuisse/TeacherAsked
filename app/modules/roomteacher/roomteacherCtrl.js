(function() {
	'use strict';

	/**
	* @ngdoc function
	* @name app.controller:roomteacherCtrl
	* @description
	* # roomteacherCtrl
	* Controller of the app
	*/

  	angular
		.module('roomteacher')
		.controller('RoomteacherCtrl', Roomteacher);

		Roomteacher.$inject = ['$timeout', '$q', '$scope', '$state', '$stateParams', '$localStorage', 'toaster', 'RoomteacherService'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Roomteacher($timeout, $q, $scope, $state, $stateParams, $localStorage, toaster, RoomteacherService) {
			/*jshint validthis: true */
			var vm = this;

			vm.typeAnswer = "text";

			vm.roomId;

			var currentRoomId = $stateParams.roomId;
			var teacher;
			var room;
			var socket;

			if($localStorage.token == undefined){
				toaster.pop('error', "Room Teacher", 'No token! Log in please!');
				return $state.go('home');
			}

			var checkRoom = RoomteacherService.getRoom(currentRoomId)
			.then(function(res){
				if(res.status != 200){
					toaster.pop('error', "Room Teacher", "Room id invalid!");
					return $state.go('teacherprofile');
				}else{
					room = res.data;
					vm.roomId = room.roomId;
				}
			});

			var checkTeacher = RoomteacherService.getTeacher($localStorage.token)
			.then(function(res){
				if(res.status == 200){
					teacher = res.data;
				}else{
					toaster.pop('error', "Room Teacher", "Token invalid, please log again!");
					return $state.go('home');
				}
			});

			$q.all([checkRoom, checkTeacher]).then(function() {
				if(teacher == undefined || room == undefined) return;

				socket = io.connect(config.socketIoURL,{query: 
					"roomId=" + room.roomId + 
					"&token=" + teacher.token + 
					"&type=teacher"});

				setupSocket($timeout, socket, toaster);
			});

			vm.dynamicAnswers = [];

			vm.addRow = function() {
				var newLength = vm.dynamicAnswers.length + 1;
				vm.dynamicAnswers.push({id: newLength, value: ""});
			};

			vm.removeRow = function() {
				if(vm.dynamicAnswers.length > 2){
					vm.dynamicAnswers.pop();
				}
			};

			vm.addRow();
			vm.addRow();

			//Functions
			vm.submitQuestion = function(){
				var toSend = {};
				toSend.question = vm.question;
				toSend.answer = {};
				toSend.answer.type = vm.typeAnswer;
				toSend.answer.possibleAnswer = {};
				if(vm.typeAnswer == 'text'){
					toSend.answer.possibleAnswer[0] = {id: 0, value: vm.correctTextAnswer};
					toSend.answer.correctAnswer = 0;
				}else if(vm.typeAnswer == 'multipleAnswer'){
					for(var dynamicAnswer of vm.dynamicAnswers){
						toSend.answer.possibleAnswer[dynamicAnswer.id] = dynamicAnswer;
					}
					toSend.answer.correctAnswer = vm.correctMultipleAnswer;
				}
				
				toSend.isAutocheck = vm.autoCheck;
				socket.emit('question', toSend);
				socket.to(room.roomId).emit('question', toSend);
				console.log(toSend);
			}
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
					//$state.go('teacherprofile');
				});
			});

			socket.on('disconnect', function(info){
				console.log("Disconnected");
				socket.disconnect();
			});

		}

})();
