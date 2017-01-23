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
			var socket;
			vm.labelsCheckAnswers = ["No data"];
  			vm.dataCheckAnswers = [0];
			vm.labelsAnswers = ["No data"];
  			vm.dataAnswers = [0];
			vm.optionsCheckAnswers = {

			};
			vm.colorsCheckAnswers = ['#2EFE2E', '#FF0000'];

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
					vm.room = res.data;
					vm.roomId = vm.room.roomId;
					$localStorage.roomId = vm.roomId;
				}

			});

			$q.all([checkRoom]).then(function() {
				if(vm.room == undefined) return;

				socket = io.connect(config.socketIoURL,{query: 
					"roomId=" + vm.room.roomId + 
					"&username=" + vm.studentUsername + 
					"&type=student"});
				$log.debug("Socket open");
				setupSocket(vm, $state, $scope, $timeout, socket, toaster);
			});

			vm.submitMultiple = function(){
				var submitAnswer = vm.room.currentQuestion.possibleMultipleAnswers[vm.answerChoose];
				if(submitAnswer == undefined || submitAnswer == ""){
					return toaster.pop('warning', "Submit", "Please specify a answer!");
				}
				vm.answer = submitAnswer.value;
				socket.emit("student_answer", {answer: submitAnswer.value, studentUsername: vm.studentUsername});
				vm.answered = true;
				toaster.pop("info", "Student room", "Your answer has been send!");
			};
			
			vm.submitSingle = function(){
				vm.answer = vm.answerText;
				if(vm.answer == undefined || vm.answer == ""){
					return toaster.pop('warning', "Submit", "Please specify a answer!");
				}
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

		function updateChart(vm){
			if(vm.lastQuestion === undefined) return;
			var answers = {};
			vm.lastQuestion.studentAnswers.some(function(answer){

				if(answers[answer.answer] === undefined){
					answers[answer.answer] = {};
					answers[answer.answer].answer = answer.answer;
					answers[answer.answer].count = 1;
				}else{
					answers[answer.answer].count = answers[answer.answer].count + 1;
				}
			});
			
			//global Answers			
			vm.labelsAnswers = [];
			vm.dataAnswers = [];
			for(var key in answers){
				var answer = answers[key];
				vm.labelsAnswers.push(answer.answer);
				vm.dataAnswers.push(answer.count);
			}

			//Correct answers
			vm.dataCheckAnswers = [];
			vm.labelsCheckAnswers = ["Correct answer", "Wrong answer"];
			
			var correctAnswerCount = 0;
			var wrongAnswerCount = 0;
			if(vm.lastQuestion.answerType == "multipleAnswer" && vm.lastQuestion.isAutocheck){
				var correctAnswer = vm.lastQuestion.possibleMultipleAnswers[vm.lastQuestion.correctMultipleAnswer].value;
				for(var key in answers){
					var answer = answers[key];
					if(answer.answer == correctAnswer){
						correctAnswerCount = answer.count;
					}else{
						wrongAnswerCount = wrongAnswerCount + answer.count;
					}
				}
			}else if(vm.lastQuestion.answerType == "text" && vm.lastQuestion.isAutocheck){
				var correctAnswer = vm.lastQuestion.correctTextAnswer;
				for(var key in answers){
					var answer = answers[key];
					if(answer.answer.toLowerCase() == correctAnswer.toLowerCase()){
						correctAnswerCount = answer.count;
					}else{
						wrongAnswerCount = wrongAnswerCount + answer.count;
					}
				}
			}
			vm.dataCheckAnswers = [correctAnswerCount, wrongAnswerCount];
		}

		function setupSocket(vm, $state, $scope, $timeout, socket, toaster){

			socket.on('init_room', function(initRoom){
				$scope.$apply(function(){
					vm.room = initRoom;
					if(vm.lastQuestion === undefined && vm.room.questions.length > 0){
						vm.lastQuestion = vm.room.questions[vm.room.questions.length - 1];
					}
					updateChart(vm);
				});
			});

			socket.on('already_answer', function(answer){
				$scope.$apply(function(){
					vm.answered = true;
					vm.answer = answer.answer;
					toaster.pop("info", "Student room", "You already answered to this question! Please wait until next one");
				});
			});

			socket.on('info', function(info){
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
				$scope.$apply(function(){
					vm.room.currentQuestion = question;
				});
			})

			socket.on('close_question', function(updatedRoom){
				$scope.$apply(function(){
					vm.answered = false;
					vm.answer = "";
					vm.answerText = "";
					vm.answerChoose = undefined;
					vm.room = updatedRoom;
					vm.lastQuestion = vm.room.questions[vm.room.questions.length - 1];
					updateChart(vm);
				});
			});

			socket.on('close_room', function(){
				socket.disconnect();
				$scope.$apply(function(){
					toaster.pop('info', "Room closed", "The teacher closed this room!");
					return $state.go('home');
				});
			});
		}
})();
