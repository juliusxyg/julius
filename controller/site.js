var sqlite3 = require('sqlite3').verbose();
var databasename = 'database.db';

exports.index = function(req,res){
	var tplParam = {htmltitle: 'layout title'};
	res.render('index',tplParam);
};

exports.error = function(req,res){
	res.send('An error');
};

exports.createTable = function(req,res){
	var db = new sqlite3.Database(databasename);
	db.serialize(function() {
	  db.run("CREATE TABLE IF NOT EXISTS user (name TEXT, email TEXT, mobile INTEGER, dateline INTEGER)");
	  res.send('ok! finished');
	});
	db.close();
};

exports.addUser = function(req,res){
	var db = new sqlite3.Database(databasename);
	var name='',
		email='',
		mobile=0,
		dateline=0;
	if(req.body.name){
		name = escape(req.body.name);
	}else{
		res.redirect('/error');
	}
	if(req.body.email){
		email = escape(req.body.email);
	}
	if(req.body.mobile){
		mobile = escape(req.body.mobile);
	}
	dateline = new Date().getTime();//milliseconds
	db.serialize(function() {
	  var stmt = db.prepare("INSERT INTO user VALUES (?,?,?,?)");
	  stmt.run([name,email,mobile,dateline]);
	  stmt.finalize();
	  res.redirect('/list');
	});

	db.close();
};

exports.listUser = function(req,res){
	var db = new sqlite3.Database(databasename);
	var list = new Array();
	var tmp = '';
	db.serialize(function() {
		db.each("SELECT rowid AS id, name, email, mobile, dateline FROM user", function(err, row) {
	      tmp = row.id + ": " + unescape(row.name) + " - " + unescape(row.email) + " - " + unescape(row.mobile) + " - " + new Date(row.dateline);
	      list.push(tmp);
	  	},
	  	function(){
	  		res.render('list',{userlist: list, htmltitle: 'userlist'});
	  	});
	});
	db.close();
}

