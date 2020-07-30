function activate(content) {
	var fs = require('fs');
	
	goby.registerCommand('init', function (content) {
		let jarName = "jmet-0.1.0-all.jar";
		fs.copyFileSync(__dirname+"/"+jarName, rootPathData+"/golib/external/"+jarName);
	});
}

exports.activate = activate;