//initialization and configuration Application
var express = require('express'),
	c = require('cookies'),
	io = require('socket.io'),
	app = express.createServer(c.express()),
  common = require('./common.js'),
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
app.get('/backend/:op',site.backendDispatcher);
app.post('/backend/:op',site.backendDispatcher);
app.get('/articles',site.listArticle);

app.listen(8081);

//chat room
var users = {};
var chatlogfile = 'chat_history_log_'+ common.dateFormat("yyyy-MM-dd") +'.log';

io.sockets.on('connection', function (socket) {
  socket.on('mymessage',function(msg){
  	if(msg){
  		var output = socket.username + ' says: <br>';
  		if(msg.msg){
  			output += msg.msg;
  		}
  		if(msg.pic){
  			output += '<br/><img src="/upload/'+msg.pic+'" />';
  		}
  		io.sockets.in(socket.room).emit('mymessage', output+'<br/>--> '+ common.dateFormat("yyyy-MM-dd EE hh:mm:ss") );
      //log history
      common.writeLog(chatlogfile, common.dateFormat("yyyy-MM-dd EE hh:mm:ss") + "###" +socket.username + "###" + (msg.msg?msg.msg:'') + "###" + (msg.pic?msg.pic:'') + "###");
  	}
  });

  socket.on('login',function(user){
  	if(user){
      socket.room = user.room;
      socket.join(user.room);
	  	socket.username = user.name;
      if(!users[user.room]){
        users[user.room]={};
      }
	  	users[user.room][user.name] = user.name;
	  	io.sockets.in(socket.room).emit('userlist',users[user.room]);
    }
  });


  socket.on('disconnect',function(){
    delete users[socket.room][socket.username];
    socket.leave(socket.room);
    io.sockets.in(socket.room).emit('userlist',users[socket.room]);
    if(!users[socket.room]){
      delete users[socket.room];
    }
  });
});