function activate(content) {
	var fs = require('fs');
	
	goby.registerCommand('init', function (content) {
		let jarName = "ysoserial-0.0.6-SNAPSHOT-all.jar";
		fs.copyFileSync(__dirname+"/"+jarName, rootPathData+"/golib/external/"+jarName);
	});
}

exports.activate = activate;