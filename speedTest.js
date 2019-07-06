var speedTest = require('speedtest-net');
var mqtt = require('mqtt');
var config = require('./speedTest_config.json');
var client  = mqtt.connect(config.mqtt_broker);
console.dir(config);
client.on('connect',function(){
	console.log("Successfully connceted to " + config.mqtt_broker);
	try{
		setInterval(function(){
			var test = speedTest({maxTime: (config.max_time_out || 5000)}); 
			test.on('data',function(data){
				//console.dir(data);
				try{
					client.publish("info/heartbeat/"+config.mac+"/net_dwnld", data.speeds.download.toString());
					console.log("Publishing "+"info/heartbeat/"+config.mac+"/net_dwnld  => "+ data.speeds.download.toString());
					client.publish("info/heartbeat/"+config.mac+"/net_upld", data.speeds.upload.toString());
					console.log("Publishing "+"info/heartbeat/"+config.mac+"/net_upld  => "+ data.speeds.upload.toString());
				}
				catch(exception){
					console.error("Error while publishing data " + exception);
					console.log(exception.stack);
				}
			});

			test.on('error', function(err) {
				console.error("Error while connecting to speedtest.net");
			 	console.error(err);
			});
		},(config.interval || 60000));
	}
	catch(exception){
		 console.log("something went wrong !", exception);
	}
});/*




 
test.on('data', data => {
  console.dir(data);
});
 
test.on('error', err => {
  console.error(err);
});

function edgeMqttSocket(config){
    var client  = mqtt.connect(config.url);
    console.log("initializing socket connection with "+ config.url);
    client.on('connect',function(){
        try{
            setInterval(function(){
                var input = fs.readFileSync(config.input_data).toString();
                console.log(JSON.parse(input));
                //var machineId = (JSON.parse(input)['header'] || {} )['machineId'] || "";
                //console.log(machineId);
                var output = fs.readFileSync(config.output_data).toString();
                console.log(JSON.parse(output));
                var time  = moment().tz("America/New_York").format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
                client.publish('edge/input@@'+config.input_data.split('/').pop(),input);
                client.publish('edge/output@@'+config.output_data.split('/').pop(),output);
                console.log(`${time} : publishing ${config.input_data}, ${config.output_data} file to ${config.ur}l}`);
            },( config.Interval || 30000 ))
        }
        catch(exception){
            console.log("something went wrong !", exception);
        }
    })

}*/