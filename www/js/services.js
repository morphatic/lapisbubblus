angular.module('starter.services', [])

.factory('DeviceListenerService', function(store, $q) {
  return {
    sparkStatusWatcher: function(data) {
      console.log(data);
    }
  };
});