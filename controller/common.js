exports.dateFormat = function(fmt,timeline) {    
	var now = timeline? new Date(timeline) : new Date();    
    var o = {        
    "M+" : now.getMonth()+1, //月份        
    "d+" : now.getDate(), //日        
    "h+" : now.getHours()%12 == 0 ? 12 : now.getHours()%12, //小时        
    "H+" : now.getHours(), //小时        
    "m+" : now.getMinutes(), //分        
    "s+" : now.getSeconds(), //秒        
    "q+" : Math.floor((now.getMonth()+3)/3), //季度        
    "S" : now.getMilliseconds() //毫秒        
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
        fmt=fmt.replace(RegExp.$1, (now.getFullYear()+"").substr(4 - RegExp.$1.length));        
    }        
    if(/(E+)/.test(fmt)){        
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[now.getDay()+""]);        
    }        
    for(var k in o){        
        if(new RegExp("("+ k +")").test(fmt)){        
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));        
        }        
    }        
    return fmt;        
}

exports.writeLog = function(fname,content){
    var fs = require('fs');
    fs.open('./log/'+fname, 'a', 0666, function(err,fd){
        if(err){
            throw err;
        }
        var c = content+"\r\n";
        fs.write(fd, c, null, 'utf8', function(e){
            if(e) throw e;
            fs.closeSync(fd);
        });
    });
}