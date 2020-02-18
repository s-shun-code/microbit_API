var targetDevice;
 
function getTemperature() {
 
  const UUID_TEMPERATURE_SERVICE = 'e95d6100-251d-470a-a062-fa1922dfa9a8'
  const UUID_TEMPERATURE_SERVICE_CHARACTERISTIC_DATA   = 'e95d9250-251d-470a-a062-fa1922dfa9a8'
  const UUID_TEMPERATURE_SERVICE_CHARACTERISTIC_PERIOD = 'e95d1b25-251d-470a-a062-fa1922dfa9a8'
 
  const INTERVAL = 1000
 
  navigator.bluetooth.requestDevice({
    filters: [
      { namePrefix: "BBC micro:bit" }
    ],
    optionalServices: [UUID_TEMPERATURE_SERVICE]
  })

  .then(device => {
    targetDevice = device;
    console.log("device", device);
    return device.gatt.connect();
  })

    .then(server => {
    console.log('server', server);
    server.getPrimaryService(UUID_TEMPERATURE_SERVICE)

    .then(service => {

      service.getCharacteristic(UUID_TEMPERATURE_SERVICE_CHARACTERISTIC_PERIOD)
      .then(characteristic => {
        characteristic.writeValue(new Uint16Array([INTERVAL]));
      })
      .catch(error => {
        console.log(error);
        alert('取得間隔の設定に失敗しました。');
      })
 
      service.getCharacteristic(UUID_TEMPERATURE_SERVICE_CHARACTERISTIC_DATA)
      .then(characteristic => {
        characteristic.startNotifications()
        .then(char => {
          alert('接続しました。');
          characteristic.addEventListener('characteristicvaluechanged',onTemperatureChanged);
          console.log('Temperature : ', char);
        })
      })
      .catch(error => {
        console.log(error);
        alert('取得開始に失敗しました。');
      })
    })
  })
  .catch(error => {
    console.log(error);
    alert('接続に失敗しました。');
  });
 

  function onTemperatureChanged (event) {
    let temperature = event.target.value.getUint8(0, true);
    console.log('温度 : ' + temperature); 
    document.getElementById("show_temp").innerText = 'ただいまの気温は' + temperature + '℃です。';
  }
}
 

function disconnect() {
 
  if (!targetDevice || !targetDevice.gatt.connected){
    return;
  }
  targetDevice.gatt.disconnect();
  alert("切断しました。");
 
}