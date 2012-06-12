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
app.post('/img',site.uploadImg);

app.listen(8081);

var users = {};

io.sockets.on('connection', function (socket) {
  socket.on('mymessage',function(msg){
  	if(msg){
  		var output = socket.username + ': ';
  		if(msg.msg){
  			output += msg.msg;
  		}
  		if(msg.pic){
  			output += '<br/><img src="/upload/'+msg.pic+'" />';
  		}
  		io.sockets.emit('mymessage', output+'<br/>--'+ new Date());
  	}
  });

  socket.on('login',function(name){
  	if(name){
	  	socket.username = name;
	  	users[name] = name;
	  	io.sockets.emit('userlist',name);
	}
  });
});