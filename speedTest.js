var mqtt = require('mqtt');
var config = require('/usr/src/conf/speedTest_config.json');
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;


var client = mqtt.connect(config.mqtt_broker);

//var mac = execSync('cat /sys/class/net/eth0/address').toString().substring(0,17);
var mac = "b8:27:eb:30:05:d8";
console.dir(config);
	client.on('connect',function(){
		console.log("Successfully connceted to " + config.mqtt_broker);
		try{
            setInterval(function(){
            exec('/usr/src/conf/speedtest.py --simple',(err, stdout, stderr)=>{
                if(stdout){
                    var str = stdout.toString();
                    //console.log(str);
                    var temp1 = str.split('\n');
                    //console.dir(temp1);
                    var dwnldSpd = temp1[1].split(':')[1].replace(" Mbit/s","");
                    var upldSpd = temp1[2].split(':')[1].replace(" Mbit/s","");
                    console.log("dwnldSpd "+dwnldSpd+" upLoad "+upldSpd);
                    client.publish("info/heartbeat/"+mac+"/net_dwnld", dwnldSpd);
                    client.publish("info/heartbeat/"+mac+"/net_upld", upldSpd);
		    console.log("Published "+ "dwnldSpd "+dwnldSpd+" upLoad "+upldSpd);
                }
                else if(stderr){
                    console.error('Error is running speed.py'+stderr);
                }
                else{
                    console.log("something went wrong !",err)
                }
            });
            },1000*60);
        }
		catch(exception){
			console.log("something went wrong !", exception);
		}
	});
