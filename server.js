//assign modules
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const socket = require('socket.io')

//assign route
const task = require('./routes/api/task')

//declare express app()
const app = express();

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//configure DB for production or development
const db = require('./config/keys').mongoURI;

//connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true }).then(() => {
  console.log(`MongoDB connected on ${db}`);
}).catch(err => {
  console.log(`MongoDB connection error : ${err} on : ${db}`);
})

//Allow XHttp request 
app.use(function (req, res, next) {
  //res.header('Access-Control-Allow-Origin', 'http://localhost:8080/');
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
  next();
});


//path to html file
app.use(express.static("public"));
app.get('/', function (req, res) {
  res.sendFile('index.html');
});


//declare route name
app.use('/api/task', task);

//declare port
port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT : ${port}`);
})


// Set up socket.io
const io = socket(server);
let online = 0;

io.on('connection', (socket) => {
  online++;
  console.log(`Socket ${socket.id} connected.`);
  console.log(`Online: ${online}`);
  io.emit('visitor enters', online);

  socket.on('add', data => socket.broadcast.emit('add', data));
  socket.on('update', data => socket.broadcast.emit('update', data));
  socket.on('delete', data => socket.broadcast.emit('delete', data));

  socket.on('disconnect', () => {
    online--;
    console.log(`Socket ${socket.id} disconnected.`);
    console.log(`Online: ${online}`);
    io.emit('visitor exits', online);
  });
});
