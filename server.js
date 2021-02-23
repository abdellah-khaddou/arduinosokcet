const app = require('express')();
//var cors = require('cors');
//app.use(cors());
const http = require('http').Server(app);
const io = require('socket.io')(http,{

  cors: {
    origin: "http://localhost:8100",
    methods: ["GET", "POST"],

  }
});

app.get('/', (req, res) => {
  res.send({name:"hello"});
});

// client.on("connect", function () {
//   console.log("connected  " + client.connected);
// })
// io.on('connection', (socket) => {
//   console.log('a user connected');
//   socket.on('phone', (msg) => {

//     let myobject = JSON.parse(msg);
//       let insideHome = myobject.inside;
//       let outsideHome = myobject.outside;
//       console.log(myobject);
//       console.log('message: ' + msg);
//       io.emit('phone',"hello");

//   });
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });

http.listen(process.env.PORT || 3000, () => {
  console.log('listening on ',process.env.PORT || 3000);

});





