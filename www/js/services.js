angular.module('starter.services', [])

.factory('Devices', function(store) {

  var devices   = [],
      particle  = new Particle(),
      token     = store.get('particle_access_token');

  return {
    all: function() {
      return devices;
    },
    load: function() {
      return particle.listDevices({auth: token});
    },
    listen: function() {
      return particle.getEventStream({deviceId: "mine", auth: token});
    },
    get: function(deviceId) {
      for (var i = 0; i < devices.length; i+=1) {
        if (devices[i].id === deviceId) {
          return devices[i];
        }
      }
      return null;
    }
  };
});