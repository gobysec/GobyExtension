function activate(content) {
	goby.registerCommand('webfinder', function (content) {
		let path = __dirname + "/index.html?hostinfo=" + content.hostinfo;
		goby.showIframeDia(path, "webfinder", "441", "188");
	});
}

exports.activate = activate;