//initialization and configuration Application
var express = require('express'),
	io = require('socket.io'),
	app = express.createServer(),
	site = require('./site');//look for site.js [route separaration]

io = io.listen(app);

app.set('views',__dirname + '/../view');
app.set('view engine','ejs');
app.use(express.bodyParser());

//routing
app.get('/',site.index);
app.get('/newtable',site.createTable);
app.post('/add',site.addUser);
app.get('/list',site.listUser);
app.get('/chat',site.chatIndex);

app.listen(8081);

io.sockets.on('connection', function (socket) {
  socket.on('mymessage',function(msg){
  	io.sockets.emit('mymessage',msg+'--add by server');
  });
});