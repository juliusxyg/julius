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

Date.prototype.pattern=function(fmt) {        
    var o = {        
    "M+" : this.getMonth()+1, //月份        
    "d+" : this.getDate(), //日        
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时        
    "H+" : this.getHours(), //小时        
    "m+" : this.getMinutes(), //分        
    "s+" : this.getSeconds(), //秒        
    "q+" : Math.floor((this.getMonth()+3)/3), //季度        
    "S" : this.getMilliseconds() //毫秒        
    };        
    var week = {        
    "0" : "\u65e5",        
    "1" : "\u4e00",        
    "2" : "\u4e8c",        
    "3" : "\u4e09",        
    "4" : "\u56db",        
    "5" : "\u4e94",        
    "6" : "\u516d"       
    };        
    if(/(y+)/.test(fmt)){        
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));        
    }        
    if(/(E+)/.test(fmt)){        
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);        
    }        
    for(var k in o){        
        if(new RegExp("("+ k +")").test(fmt)){        
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));        
        }        
    }        
    return fmt;        
}       

var users = {};

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
  		io.sockets.emit('mymessage', output+'<br/>--> '+ (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") );
  	}
  });

  socket.on('login',function(name){
  	if(name){
	  	socket.username = name;
	  	users[name] = name;
	  	io.sockets.emit('userlist',users);
    }
  });


  socket.on('disconnect',function(){
    delete users[socket.username];
    io.sockets.emit('userlist',users);
  });
});