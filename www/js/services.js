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
      return particle.getDevice({deviceId: deviceId, auth: token});
    },
    getVar: function(deviceId, varName) {
      return particle.getVariable({deviceId: deviceId, name: varName, auth: token});
    },
    call: function(deviceId, funcName, arg) {
      return particle.callFunction({deviceId: deviceId, name: funcName, argument: arg, auth: token});
    }
  };
});