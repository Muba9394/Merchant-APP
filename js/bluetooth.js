//bluetooth class
var bluetooth = function ($q, $window) {
    var _this = this;

    this.isEnabled = function () {
        var d = '';
        function successCallback(success) {
            d = true;
        }
        function errorCallback(error) {
            d = false;
        }
        if (getStorage("device_platform") == "Android") {
            bluetoothSerial.isEnabled(successCallback, errorCallback);
        }

        return d;
    }

    //enable bluetooth
    this.enable = function () {
        var d = '';
        if (getStorage("device_platform") == "Android") {
            bluetoothSerial.enable(function (success) {
                d = success;
            }, function (error) {
                d = error;
            })
        }
        return d;
    }

    //startScan()
    /*this.startScan = function () {

        var d = [];
        var dups = [];

        if (getStorage("device_platform") == "Android") {

            bluetoothSerial.discoverUnpaired(function (devices) {
                d.push(devices);
                //$("#con_devices").append('<ons-list-item modifier="tappable" onclick="conDevice('+devices.id+');">'+devices.name+'</ons-list-item>');
            }, function (error) {
                d = error;
            });


            bluetoothSerial.setDeviceDiscoveredListener(function (device) {
                d.push(device);

            });


            var arr = d.filter(function(el) {
              // If it is not a duplicate, return true
              if (dups.indexOf(el.id) == -1) {
                dups.push(el.id);
                return true;
              }

              return false;

            });

            var html = '';


            for (var i = 0, len = dups.length; i < len; i++) {
                html += '<li onclick="savePrinter(\'' + dups[i].id + '\');" style="padding:10px;">' + dups[i].name + '</li>';
            }

            setStorage("device_list", html);

        }

        //  alert(getStorage('device_list'));

        return dups;
    }*/

    this.startScan = function () {
	  var html = '';
      var d = [];
      if (getStorage("device_platform") == "IOS") {
        ble.startScan([], function (device) {
          d = device;
        }, function (error) {
          d =error;
        });
      } else if (getStorage("device_platform") == "Android") {
        bluetoothSerial.setDeviceDiscoveredListener(function (device) {
          d.push(device);
          html += '<li onclick="savePrinter(\''+device.id+'\');" style="padding:10px;">'+device.name+'</li>';
         // html += '<ons-list-item modifier="tappable" onclick="savePrinter(\''+device.id+'\');" style="padding:10px;">'+device.name+'>';
          //html += '<ons-icon icon="fa-bluetooth"></ons-icon><ons-icon icon="fa-printer"></ons-icon><span>'+device.name+'</span></ons-list-item>';


        });
        bluetoothSerial.discoverUnpaired(function (devices) {
          d.push(devices);
		  //$("#con_devices").append('<ons-list-item modifier="tappable" onclick="conDevive('+devices.id+');">'+devices.name+'</ons-list-item>');
        }, function (error) {
          d = error;
        });
      }

     setTimeout(function() {setStorage("device_list",html)},10000);
	 //alert(getStorage('device_list'));

      return html;
    }


    //stopScan()
    this.stopScan = function () {
        ble.stopScan(null,null);
        //bluetoothSerial.clearDeviceDiscoveredListener();
        var d = $q.defer;
        return d.promise;
    }

    //isConnected()
    this.isConnected = function (deviceId,$q) {
        var d = $q.defer();
        function successCallback(success) {
            d.resolve(true);
        }
        function errorCallback(error) {
            d.resolve(false);
        }
        if (getStorage("device_platform") == "Android") {
            bluetoothSerial.isConnected(successCallback, errorCallback);
        }
        return d.promise;
    }

    //connect function
    this.connect = function (deviceId) {
        var d = '';
        function successCallback(success) {
            d='true';
        }
        function errorCallback(error) {
            d='false';
        }
        // without bond
        bluetoothSerial.connectInsecure(deviceId, successCallback, errorCallback);

        return d;
    }

    //disconnect function
    this.disconnect = function (deviceId, $q) {
        var d = $q.defer();
        function successCallback(success) {
            d.resolve(success);
        }
        function errorCallback(error) {
            d.reject(error);
        }
        if (getStorage("device_platform") == "Android") {
            $window.bluetoothSerial.disconnect(successCallback, errorCallback);
        }
        return d.promise;
    }

    //write function
    this.write = function (buffer, deviceId) {
        var d = '';
        function successCallback(success) {
            alert(success);
            d='true';
        }
        function errorCallback(error) {
            d='false';
        }
        if (getStorage("device_platform") == "Android") {
            bluetoothSerial.write(buffer, successCallback, errorCallback);
        }
        return d;
    }
};
