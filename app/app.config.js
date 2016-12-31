(function () {
	'use strict';

	/**
	 * @ngdoc configuration file
	 * @name app.config:config
	 * @description
	 * # Config and run block
	 * Configutation of the app
	 */

	angular
		.module('teacherasked')
		.config(configure)
		.run(runBlock);
		//.run(setupSocketIO);

	configure.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$qProvider'];

	function configure($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $qProvider) {

		$qProvider.errorOnUnhandledRejections(false);

		$locationProvider.hashPrefix('!');

		// This is required for Browser Sync to work poperly
		$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

		
		$urlRouterProvider
			.otherwise('/home');
		
	}

	runBlock.$inject = ['$rootScope'];

	function runBlock($rootScope) {
		'use strict';

		console.log('AngularJS run() function...');
	}

  function setupSocketIO(socketio, $rootScope) {
    console.log("setup socket io factory");
    console.log(socketio);
    socketio.init();

    socketio.on('msg_welcome', function (msg) {
      console.log("welcome message received via socket.io received in pages.module.js");
      console.log(msg);
      console.log("broadcasting socket.io message via AngularJS event system");
      $rootScope.$broadcast('msg_welcome', msg);
    });
    socketio.on('msg_question', function (msg) {
      console.log("question message received via socket.io in app.config.js");
      console.log(msg);
      console.log("broadcasting socket.io message via AngularJS event system");
      $rootScope.$broadcast('msg_question', msg);
    });
  }
})();
