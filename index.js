const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
let dataMaison;
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('maison', (msg) => {
    dataMaison = msg;
    console.log('message: ' + msg);
    io.emit('maison', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});




