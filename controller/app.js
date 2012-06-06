//initialization and configuration Application
var express = require('express'),
	app = express.createServer(),
	site = require('./site');//look for site.js [route separaration]

app.set('views',__dirname + '/../view');
app.set('view engine','ejs');
app.use(express.bodyParser());

//routing
app.get('/',site.index);
app.get('/newtable',site.createTable);
app.post('/add',site.addUser);
app.get('/list',site.listUser);

app.listen(8081);