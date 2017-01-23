(function () {
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

		vm.labelsCheckAnswers = ["No data"];
		vm.dataCheckAnswers = [0];
		vm.labelsAnswers = ["No data"];
		vm.dataAnswers = [0];
		vm.optionsCheckAnswers = {

		};
		vm.colorsCheckAnswers = ['#2EFE2E', '#FF0000'];

		var currentRoomId = $stateParams.roomId;
		var teacher;
		var socket;

		if ($localStorage.token == undefined) {
			toaster.pop('error', "Room Teacher", 'No token! Log in please!');
			return $state.go('home');
		}

		if (currentRoomId == "0000" && $localStorage.roomId !== undefined) {
			currentRoomId = $localStorage.roomId;
		}

		var checkRoom = RoomteacherService.getRoom(currentRoomId)
			.then(function (res) {
				if (res.status != 200) {
					toaster.pop('error', "Room Teacher", "Room id invalid!");
					return $state.go('teacherprofile');
				} else {
					vm.roomId = res.data.roomId;
					$localStorage.roomId = vm.roomId;
				}
			});

		var checkTeacher = RoomteacherService.getTeacher($localStorage.token)
			.then(function (res) {
				if (res.status == 200) {
					teacher = res.data;
				} else {
					toaster.pop('error', "Room Teacher", "Token invalid, please log again!");
					return $state.go('home');
				}
			});

		$q.all([checkRoom, checkTeacher]).then(function () {
			if (teacher == undefined || vm.roomId == undefined) return;

			socket = io.connect("/", {
				query:
				"roomId=" + vm.roomId +
				"&token=" + teacher.token +
				"&type=teacher"
			});

			setupSocket($scope, $state, $timeout, socket, toaster, vm);
		});

		vm.dynamicAnswers = [];

		vm.addRow = function () {
			vm.dynamicAnswers.push({ id: vm.dynamicAnswers.length, value: "" });
		};

		vm.removeRow = function () {
			if (vm.dynamicAnswers.length > 2) {
				vm.dynamicAnswers.pop();
			}
		};

		vm.addRow();
		vm.addRow();

		//Functions
		vm.submitQuestion = function () {
			var toSend = {};
			toSend.possibleMultipleAnswers = [];
			toSend.question = vm.question;
			toSend.answerType = vm.typeAnswer;
			if (vm.typeAnswer == 'text') {
				toSend.correctTextAnswer = vm.correctTextAnswer;
			} else if (vm.typeAnswer == 'multipleAnswer') {
				for (var dynamicAnswer of vm.dynamicAnswers) {
					toSend.possibleMultipleAnswers[dynamicAnswer.id] = { id: dynamicAnswer.id, value: dynamicAnswer.value };
				}
				toSend.correctMultipleAnswer = vm.correctMultipleAnswer;
			}

			toSend.isAutocheck = vm.autoCheck;

			socket.emit('question', toSend);
		}
		vm.closeQuestion = function () {
			socket.emit('close_question');
		};
		vm.closeRoom = function () {
			socket.emit('close_room');
		}

	}

	function updateChart(vm) {
		if (vm.lastQuestion === undefined) return;
		var answers = {};
		vm.lastQuestion.studentAnswers.some(function (answer) {

			if (answers[answer.answer] === undefined) {
				answers[answer.answer] = {};
				answers[answer.answer].answer = answer.answer;
				answers[answer.answer].count = 1;
			} else {
				answers[answer.answer].count = answers[answer.answer].count + 1;
			}
		});

		//global Answers			
		vm.labelsAnswers = [];
		vm.dataAnswers = [];
		for (var key in answers) {
			var answer = answers[key];
			vm.labelsAnswers.push(answer.answer);
			vm.dataAnswers.push(answer.count);
		}

		//Correct answers
		vm.dataCheckAnswers = [];
		vm.labelsCheckAnswers = ["Correct answer", "Wrong answer"];

		var correctAnswerCount = 0;
		var wrongAnswerCount = 0;
		if (vm.lastQuestion.answerType == "multipleAnswer" && vm.lastQuestion.isAutocheck) {
			var correctAnswer = vm.lastQuestion.possibleMultipleAnswers[vm.lastQuestion.correctMultipleAnswer].value;
			for (var key in answers) {
				var answer = answers[key];
				if (answer.answer == correctAnswer) {
					correctAnswerCount = answer.count;
				} else {
					wrongAnswerCount = wrongAnswerCount + answer.count;
				}
			}
		} else if (vm.lastQuestion.answerType == "text" && vm.lastQuestion.isAutocheck) {
			var correctAnswer = vm.lastQuestion.correctTextAnswer;
			for (var key in answers) {
				var answer = answers[key];
				if (answer.answer.toLowerCase() == correctAnswer.toLowerCase()) {
					correctAnswerCount = answer.count;
				} else {
					wrongAnswerCount = wrongAnswerCount + answer.count;
				}
			}
		}
		vm.dataCheckAnswers = [correctAnswerCount, wrongAnswerCount];
	}

	function setupSocket($scope, $state, $timeout, socket, toaster, vm) {

		socket.on('init_room', function (initRoom) {
			$scope.$apply(function () {
				vm.room = initRoom;
				if (vm.lastQuestion === undefined && vm.room.questions.length > 0) {
					vm.lastQuestion = vm.room.questions[vm.room.questions.length - 1];
				}
				updateChart(vm);
			});
		})

		//Use timeout to let the toaster pop, toaster doesn't show if not
		socket.on('info', function (info) {
			$scope.$apply(function () {
				toaster.pop('info', 'Information', info);
			});
		});

		socket.on('basic_error', function (error) {
			$scope.$apply(function () {
				toaster.pop('warning', 'Error', error);
			});
		});

		socket.on('critical_error', function (error) {
			socket.disconnect();
			$scope.$apply(function () {
				toaster.pop('error', 'Critical error', error);
				$state.go('teacherprofile');
			});
		});

		socket.on('disconnect', function (info) {
			socket.disconnect();
			$scope.$apply(function () {
				toaster.pop('warning', 'Disconnected', "Disconnected");
				$state.go('teacherprofile');
			});
		});

		socket.on('question', function (question) {
			$scope.$apply(function () {
				vm.room.currentQuestion = question;
			});
		});

		socket.on('student_connected', function (student) {
			$scope.$apply(function () {
				if (vm.room.connectedStudents.indexOf(student.username) == -1) {
					vm.room.connectedStudents.push(student);
				}
			});
		});

		socket.on('student_disconnected', function (newListOfStudents) {
			$scope.$apply(function () {
				vm.room.connectedStudents = newListOfStudents;
			});
		});

		socket.on('student_answer', function (answer) {
			$scope.$apply(function () {
				if (vm.room.currentQuestion.studentAnswers === undefined) {
					vm.room.currentQuestion.studentAnswers = [];
				}
				vm.room.currentQuestion.studentAnswers.push(answer);
			});
		});

		socket.on('close_question', function (updatedRoom) {
			$scope.$apply(function () {
				vm.room = updatedRoom;
				vm.lastQuestion = vm.room.questions[vm.room.questions.length - 1];
				updateChart(vm);
			});
		});

		socket.on('close_room', function () {
			socket.disconnect();
			$scope.$apply(function () {
				toaster.pop('info', "Room closed", "You closed this room! You can now only access in your profile page!");
				return $state.go('teacherprofile');
			});
		})
	}
})();
