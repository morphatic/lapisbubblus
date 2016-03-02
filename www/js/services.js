angular.module('starter.services', [])

.factory('Device', function(store) {
  var Device = function(deviceData, scope) {
        var particle = new Particle(),
            token    = store.get('particle_access_token'),
            self     = this;
        if (deviceData) {
           this.setData(deviceData);
        }
        this.scope = scope;
        particle.getEventStream({deviceId: this.id, auth: token}).then(
          function(stream) {
            stream.on('event', function(status) {
              if ("spark/status" === status.name) {
                self.setStatus(status);
                self.scope.$apply();
              }
            });
          },
          function(err) {
            console.log(err);
          }
        );
      };

  Device.prototype = {
    setData: function(deviceData) {
      angular.extend(this, deviceData);
    },
    setStatus: function(status) {
      this.connected = "online" === status.data;
    }
  };
  return Device;
});