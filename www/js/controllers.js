angular.module('starter.controllers', [])

.controller('AuthController', function(store, $scope, $ionicPopup, $state) {
  $scope.data = {};
  $scope.login = function() {
    var particle = new Particle();
    particle.login({username: $scope.data.email, password: $scope.data.password})
    .then(
      function(data) {
        store.set('particle_access_token', data.body.access_token);
        $state.go('devices');
      },
      function(err) {
        var alertPopup = $ionicPopup.alert({
          title: 'Login Failed',
          template: err.body.error_description
        });
      }
    );
  };
})

.controller('DeviceController', function(store, $scope, $ionicPopup, Device) {
  var token    = store.get('particle_access_token'),
      particle = new Particle();
  $scope.devices = [];
  particle.listDevices({auth: token}).then(
    function(response) {
      $scope.$apply(function() {
        angular.forEach(response.body, function(deviceData) {
          this.push(new Device(deviceData, $scope));
        }, $scope.devices);
      });
    },
    function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Error Listing Devices',
        template: err.body.error_description
      });
    }
  );
});