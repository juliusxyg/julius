var sqlite3 = require('sqlite3').verbose();
var databasename = 'database.db';
var fs = require('fs');

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
	      if(row){
		      tmp = row.id + ": " + unescape(row.name) + " - " + unescape(row.email) + " - " + unescape(row.mobile) + " - " + new Date(row.dateline);
		      list.push(tmp);
	  		}
	  	},
	  	function(){
	  		res.render('list',{userlist: list, htmltitle: 'userlist'});
	  	});
	});
	db.close();
}

exports.loginIndex = function(req,res){
	res.render('login',{htmltitle: 'login'});
}

exports.loginAction = function(req,res){
	var db = new sqlite3.Database(databasename);
	var name = '';
	if(req.body.username){
		name = escape(req.body.username);
	}else{
		res.redirect('/error');
	}
	db.serialize(function() {
	  var stmt = db.prepare("SELECT rowid as id, name FROM user WHERE name=?");
	  stmt.get(name,function(err, row){
	  	if(row){
	  		req.cookies.set('_USER_',row.name,{httpOnly: false});
			res.render('chat',{htmltitle: 'chat'});
	  	}else{
	  		res.send('no user:' + name);
	  	}
	  });
	  stmt.finalize();
	});
	db.close();
}

exports.uploadImg = function(req,res){
	var tmp_path = req.files.img.path;
	var target_path = './res/upload/'+escape(req.files.img.name);
	fs.rename(tmp_path, target_path, function(err){
		if(err){
			console.log(err);
			res.send('err');
		}
		res.send('<script>window.parent.myimg("'+escape(req.files.img.name)+'");</script>');
	});
}

