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

		Roomstudent.$inject = ['$log', '$timeout', '$q', '$scope', '$state', '$stateParams', '$localStorage', 'toaster', 'RoomstudentService'];

		/*
		* recommend
		* Using function declarations
		* and bindable members up top.
		*/

		function Roomstudent($log, $timeout, $q, $scope, $state, $stateParams, $localStorage, toaster, RoomstudentService) {
			/*jshint validthis: true */
			var vm = this;

			vm.roomId;
			vm.studentUsername = $stateParams.username;

			var currentRoomId = $stateParams.roomId;
			var room;
			var socket;
			vm.labelsCheckAnswers = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  			vm.dataCheckAnswers = [300, 500, 100];
			vm.labelsAnswers = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  			vm.dataAnswers = [300, 500, 100];

			if(vm.studentUsername == ""){
				if($localStorage.username === undefined || $localStorage.username == ""){
					toaster.pop('error', "Room Student", 'No username!');
					return $state.go('home');
				}else{
					vm.studentUsername = $localStorage.username;
				}
			}else{
				$localStorage.username = vm.studentUsername;
			}


			if(currentRoomId == "0000" && $localStorage.roomId !== undefined){
				currentRoomId = $localStorage.roomId;
			}
			
			$log.debug("Username: " + vm.studentUsername + " // RoomID: " + currentRoomId);

			var checkRoom = RoomstudentService.getRoom(currentRoomId)
			.then(function(res){
				if(res.status != 200){
					toaster.pop('error', "Room Student", "Room id invalid!");
					return $state.go('home');
				}else{
					room = res.data;
					vm.roomId = room.roomId;
					$localStorage.roomId = vm.roomId;
				}
			});

			$q.all([checkRoom]).then(function() {
				if(room == undefined) return;

				$log.debug("Connection: roomId: " + room.roomId + " // username: " + vm.studentUsername);

				socket = io.connect(config.socketIoURL,{query: 
					"roomId=" + room.roomId + 
					"&username=" + vm.studentUsername + 
					"&type=student"});

				setupSocket(vm, $state, $scope, $timeout, socket, toaster);
			});

			vm.submitMultiple = function(){
				var submitAnswer = vm.room.currentQuestion.possibleMultipleAnswers[vm.answerChoose];
				vm.answer = submitAnswer.value;
				socket.emit("student_answer", {answer: submitAnswer.value, studentUsername: vm.studentUsername});
				vm.answered = true;
				toaster.pop("info", "Student room", "Your answer has been send!");
			};
			
			vm.submitSingle = function(){
				vm.answer = vm.answerText;
				socket.emit("student_answer", {answer: vm.answer, studentUsername: vm.studentUsername});
				vm.answered = true;
				toaster.pop("info", "Student room", "Your answer has been send!");
			};

			vm.clickMultiple = function(id){
				vm.answerChoose = id;
			}

			vm.checkIsAnswer = function(lastQuestion, possibleAnswer){
				var returnVal = false;
				lastQuestion.studentAnswers.some(function(answer){
					if(answer.student == $localStorage.username && possibleAnswer.value == answer.answer){
						returnVal = true;
						return true;
					}
				});
				return returnVal;
			}
		}
		function setupSocket(vm, $state, $scope, $timeout, socket, toaster){

			socket.on('init_room', function(initRoom){
				$scope.$apply(function(){
					vm.room = initRoom;
				});
				console.log("received room");
				console.log(initRoom);
			});

			socket.on('already_answer', function(answer){
				console.log("Already answered!");
				$scope.$apply(function(){
					vm.answered = true;
					vm.answer = answer.answer;
					toaster.pop("info", "Student room", "You already answered to this question! Please wait until next one");
				});
			});

			socket.on('info', function(info){
				console.log(info);
				$scope.$apply(function(){
					toaster.pop('info', 'Information', info);
				});
			});

			socket.on('critical_error', function(error){
				socket.disconnect();
				$scope.$apply(function(){
					toaster.pop('error', 'Critical error', error);
					$state.go('home');
				});
			});

			socket.on('disconnect', function(info){
				socket.disconnect();
				$scope.$apply(function(){
					toaster.pop('error', 'Disconnected', "Disconnected");
					$state.go('home');
				});
			});

			socket.on('question', function(question){
				console.log("Question received!");
				$scope.$apply(function(){
					vm.room.currentQuestion = question;
				});
				console.log(question);
			})

			socket.on('close_question', function(updatedRoom){
				console.log("Question closed!");
				console.log(updatedRoom);
				$scope.$apply(function(){
					vm.room = updatedRoom;
					vm.lastQuestion = vm.room.questions[vm.room.questions.length - 1];
				});
			});
		}
})();
