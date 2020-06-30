function activate(content) {
	goby.registerCommand('http', function (content) {
		let path = __dirname + "/http.html?hostinfo=" + content.hostinfo;
		goby.showIframeDia(path, "http发包", "441", "188");
	});
}

exports.activate = activate;