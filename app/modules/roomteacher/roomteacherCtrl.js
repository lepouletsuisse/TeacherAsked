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

			vm.data = [[0]];
			vm.labels = [""];

			var currentRoomId = $stateParams.roomId;
			var teacher;
			var socket;

			if($localStorage.token == undefined){
				toaster.pop('error', "Room Teacher", 'No token! Log in please!');
				return $state.go('home');
			}

			if(currentRoomId == "0000" && $localStorage.roomId !== undefined){
				currentRoomId = $localStorage.roomId;
			}

			var checkRoom = RoomteacherService.getRoom(currentRoomId)
			.then(function(res){
				if(res.status != 200){
					toaster.pop('error', "Room Teacher", "Room id invalid!");
					return $state.go('teacherprofile');
				}else{
					vm.roomId = res.data.roomId;
					$localStorage.roomId = vm.roomId;
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
				if(teacher == undefined || vm.roomId == undefined) return;

				socket = io.connect("/",{query: 
					"roomId=" + vm.roomId + 
					"&token=" + teacher.token + 
					"&type=teacher"});

				setupSocket($scope, $state, $timeout, socket, toaster, vm);
			});

			vm.dynamicAnswers = [];

			vm.addRow = function() {
				vm.dynamicAnswers.push({id: vm.dynamicAnswers.length, value: ""});
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
				toSend.possibleMultipleAnswers = [];
				toSend.question = vm.question;
				toSend.answerType = vm.typeAnswer;
				if(vm.typeAnswer == 'text'){
					toSend.correctTextAnswer = vm.correctTextAnswer;
				}else if(vm.typeAnswer == 'multipleAnswer'){
					for(var dynamicAnswer of vm.dynamicAnswers){
						toSend.possibleMultipleAnswers[dynamicAnswer.id] = {id: dynamicAnswer.id, value: dynamicAnswer.value};
					}
					toSend.correctMultipleAnswer = vm.correctMultipleAnswer;
				}
				
				toSend.isAutocheck = vm.autoCheck;

				socket.emit('question', toSend);
			}
			vm.closeQuestion = function(){
				socket.emit('close_question');
			};
			vm.closeRoom = function(){
				socket.emit('close_room');
			}
		}
		function setupSocket($scope, $state, $timeout, socket, toaster, vm){

			socket.on('init_room', function(initRoom){
				$scope.$apply(function(){
					vm.room = initRoom;
					console.log(vm.room);
				});
			})

			//Use timeout to let the toaster pop, toaster doesn't show if not
			socket.on('info', function(info){
				console.log(info);
				$scope.$apply(function(){
					toaster.pop('info', 'Information', info);
				});
			});

			socket.on('basic_error', function(error){
				$scope.$apply(function(){
					toaster.pop('warning', 'Error', error);
				});
			});

			socket.on('critical_error', function(error){
				console.log(error);
				socket.disconnect();
				$scope.$apply(function(){
					toaster.pop('error', 'Critical error', error);
					$state.go('teacherprofile');
				});
			});

			socket.on('disconnect', function(info){
				socket.disconnect();
				$scope.$apply(function(){
					toaster.pop('warning', 'Disconnected', "Disconnected");
					$state.go('teacherprofile');
				});
			});

			socket.on('question', function(question){
				console.log("received question");
				console.log(question);
				$scope.$apply(function(){
					vm.room.currentQuestion = question;
				});
				console.log(vm.room);
			});
			
			socket.on('student_connected', function(student){
				$scope.$apply(function(){
					vm.room.students.push(student);	
				});
			});

			socket.on('student_disconnected', function(newListOfStudents){
				$scope.$apply(function(){
					vm.room.connectedStudents = newListOfStudents;
				});
			});

			socket.on('student_answer', function(answer){
				$scope.$apply(function(){
					console.log("Received answer");
					console.log(answer);
					if(vm.room.currentQuestion.studentAnswers === undefined){
						vm.room.currentQuestion.studentAnswers = [];
					}
					vm.room.currentQuestion.studentAnswers.push(answer);
				});
			});

			socket.on('close_question', function(updatedRoom){
				$scope.$apply(function(){
					console.log("Received close question");
					vm.room = updatedRoom;
					console.log(vm.room);
				});
			});

			socket.on('close_room', function(){
				socket.disconnect();
				$scope.$apply(function(){
					toaster.pop('info', "Room closed", "You closed this room! You can now only access in your profile page!");
					return $state.go('teacherprofile');
				});
			})
		}
})();
