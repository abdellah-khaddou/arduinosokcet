const app = require('express')();
var cors = require('cors');
app.use(cors());
app.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin','*')
  next();
})
const http = require('http').Server(app);
const io = require('socket.io')(http,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true
  }
});

var start = true;

var arduinoInside,arduinoOutside;
var inside  = {led:0,redou:0,temp:0,humd:0}
var outside = {roboni:0,humd:0,chta:0}
var mqtt = require('mqtt');
var count = 0;
var hasIndarChange = true;
var client = mqtt.connect("mqtt://test.mosquitto.org", {});
console.log("connected flag  " + client.connected);

//handle incoming messages


client.on('message', function (topic, message, packet) {
  message+="";
  console.log("mesage is :: ",message)
  console.log("topic is :: ",topic)

  if(!message.includes("<Buffer")){
    if(topic == "outside"){// outside bra dyal dar jat data
      arduinoOutside =message;
      arduinoInside = traitementOutside(arduinoOutside,arduinoInside)
      publish("indar", arduinoInside, {});
      let data = JSON.stringify({arduinoInside,arduinoOutside})
      io.emit('phone', data);
    }else if(topic=="home"){//inside fe ldakhel dyal dar jat data
      arduinoInside =message;
      traitementInside(arduinoInside);
      let data = JSON.stringify({arduinoInside,arduinoOutside})
      io.emit('phone', data);
    }

  }




});


client.on("connect", function () {
  console.log("connected  " + client.connected);

})
//handle errors
client.on("error", function (error) {
  console.log("Can't connect" + error);
  process.exit(1)
});
//publish
function publish(topic, msg, options) {
  console.log("publishing", msg);

  if (client.connected == true) {

    client.publish(topic, msg, options);

  }


}

//////////////



var message = "test message";
console.log("subscribing to topics");

client.subscribe("home", { }); //topic list
client.subscribe("outside", { }); //topic list
client.subscribe("phone", { }); //topic list

// if(start){
//   start = false;
//   publish("indar", "1,75,1029,1023", {});

// }
// publish("onphone", "arduinoInside", {});

// setInterval(()=>{
//   publish("indar", "1,75,1029,1023", {});
// },5000)

//notice this is printed even before we connect
console.log("end of script");






// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/client.html');
// });
client.on("connect", function () {
  console.log("connected  " + client.connected);
   // hadi bach ghir ibda ijib data mn arduino bach itlab mn arduino i3tih data
})
io.on('connection', (socket) => {
  console.log('a user connected');
  publish("indar", "s", {});
  socket.on('phone', (msg) => {

    let myobject = JSON.parse(msg);
    let ins = myobject.inside;
    let out= myobject.outside;
    arduinoInside = ins.led +","+ ins.redou+","+ins.temp+","+ins.humd;
    arduinoOutside = out.roboni+","+out.rain+","+out.torba;
    publish("indar", arduinoInside, {});
    //publish("outdar", arduinoOutside, {});
    console.log("obj",myobject);
    console.log('message: ' + JSON.stringify(msg));


  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log('listening on ',process.env.PORT || 3000);

});


function traitementInside(insidex){
  console.log(insidex);
  insidex+=''
  if(insidex){
    let x     = insidex.split(',');
    if(x[3]){
      inside.redou = parseInt(x[0]);
      inside.led  = parseInt(x[1]);
      let temp  = parseInt(x[2]);
      let humd  = parseInt(x[3]);
      inside.temp = temp = temp>=1000 ? temp -1000 : -temp;
      inside.humd = humd = humd>=1000 ? humd -1000 : -humd;
    }

  }


}

function traitementOutside(outsidex,insidex){
  if(outsidex){
    let x     = outsidex.split(',');
    outside.roboni = parseInt(x[0]);
    outside.chta  = parseInt(x[2]);
    let humd  = parseInt(x[1]);
    outside.humd = humd = humd>=1000 ? humd -1000 : -humd;
    if(chta ==1){
      let y     = insidex.split(',');
      Y[0]=1;
      y[1]=99;
      y.join(',');
      return y;
    }

  }

return insidex;
}



