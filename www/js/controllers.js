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

.controller('DevicesController', function($scope, Devices) {
  $scope.devices = [];
  Devices.load().then(
    function(deviceList) {
      angular.forEach(deviceList.body, function(deviceData) {
        this.push(deviceData);
      }, $scope.devices);
      $scope.$apply();
    },
    function(err) {console.log(err);}
  );
  Devices.listen().then(
    function(stream) {
      stream.on('event', function(status) {
        if ("spark/status" === status.name) {
          for (var i = 0; i < $scope.devices.length; i+=1) {
            if ($scope.devices[i].id === status.coreid) {
              $scope.devices[i].connected = "online" === status.data;
              $scope.$apply();
            }
          }
        }
      });
    },
    function(err) {console.log(err);}
  );
})

.controller('DeviceController', function($scope, $stateParams, Devices) {
  $scope.device = {};
  Devices.get($stateParams.id).then(
    function(deviceData) {
      $scope.device = deviceData.body;
      $scope.$apply();
    },
    function(err) {console.log(err);}
  );

  Devices.getVar($stateParams.id, "color").then(
    function(data) {
      var color = '#' + Number(data.body.result).toString(16);
      $scope.device.solidColor = color;
      $scope.$apply();
    },
    function(err)  { console.log(err); }
  );

  $scope.showRainbow = function() {
    Devices.call($stateParams.id, "setShow", "rainbow");
  };

  $scope.showSolid = function() {
    Devices.call($stateParams.id, "setShow", "solidColor");
  };

  $scope.showStrobe = function() {
    Devices.call($stateParams.id, "setShow", "strobe");
  };

  $scope.showPulse = function() {
    Devices.call($stateParams.id, "setShow", "pulse");
  };

  $scope.$on('modal.hidden', function() {
    Devices.call($stateParams.id, "setColor", $scope.device.solidColor.substring(1));
  });

});