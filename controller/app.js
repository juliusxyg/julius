//initialization and configuration Application
var express = require('express'),
	c = require('cookies'),
	io = require('socket.io'),
	app = express.createServer(c.express()),
	site = require('./site');//look for site.js [route separaration]

io = io.listen(app);

app.set('views',__dirname + '/../view');
app.set('view engine','ejs');
app.use(express.bodyParser());
app.use(express.directory(__dirname + '/../res'));
app.use(express.static(__dirname + '/../res'));

//routing
app.get('/',site.index);
app.get('/newtable',site.createTable);
app.post('/add',site.addUser);
app.get('/list',site.listUser);
app.get('/login',site.loginIndex);
app.post('/chat',site.loginAction);

app.listen(8081);

io.sockets.on('connection', function (socket) {
  socket.on('mymessage',function(msg){
  	if(msg.name){
  		io.sockets.emit('mymessage',msg.name + ': ' + msg.msg+'--'+ new Date());
  	}
  });
});