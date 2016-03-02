// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'angular-storage'])

.run(function($ionicPlatform, $rootScope, store, $state) {

  // route all requests to login screen if necessary, i.e. no Particle API access token has been stored
  $rootScope.$on('$stateChangeStart', function(e, toState) {
    if ('login' !== toState.name) {
      // get the access token for the particle API
      var token = store.get('particle_access_token');
      if (null === token) {
        e.preventDefault();
        $state.go('login');
      }
    }
  });

  var p = new Particle(), token = store.get('particle_access_token');
  p.getEventStream({deviceId: "mine", auth: token})
   .then(
    function(stream) { 
      stream.on('event', function(data) {
        console.log(data);
      });
    },
    function(err) {
      console.log(err);
    });

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'AuthController'
  })

  .state('devices', {
    url: '/devices',
    templateUrl: 'templates/devices.html',
    controller: 'DeviceController'
  });

  $urlRouterProvider.otherwise('/devices');
});