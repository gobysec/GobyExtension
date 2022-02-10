function activate(content) {
	var fs = require('fs');
	var path = require('path');
	goby.registerCommand('init', function (content) {
		// 主题名字
		let name = '{{name}}';
		// 主题配置
		let config = {{config}};
		let userConfigJson = require(configPath);
		if (!userConfigJson.theme) {
			userConfigJson.theme = {};
		}
		userConfigJson.theme[name] = config;
		userConfigJson.curTheme = name;
		setTheme(config);
		let mergeConfigJson = JSON.stringify(userConfigJson, null, 6);
		fs.writeFileSync(configPath, mergeConfigJson);
	});
}

exports.activate = activate;
