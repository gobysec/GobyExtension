function activate(content) {
	goby.registerCommand('subDomainsBrute', function () {
		let path = __dirname + "/index.html?curDirname=" + __dirname;
		goby.showIframeDia(path, "子域名爆破", "666", "500");
	});
}

exports.activate = activate;