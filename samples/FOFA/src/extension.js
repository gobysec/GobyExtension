function activate(content) {
	goby.registerCommand('fofa', function () {
		let config = goby.getConfiguration();
		let email = config.Email.default;
		let key = config.Key.default;
		if (email && key) {
			let path = __dirname + "/fofa.html"
			goby.showIframeDia(path, "fofa查询", "666", "500");
		} else {
			goby.showConfigurationDia();
		}
	});
}

exports.activate = activate;