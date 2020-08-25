function activate(content) {
	var fs = require('fs');
	
	goby.registerCommand('init', function (content) {
		// 主题名字
		let name = "The Matrix";
		// 主题配置
		let config = {
			"main": "#00bc3c",
			"primaryFont": "rgba(255, 255, 255, 0.87)",
			"secondaryFont": "rgba(255, 255, 255, 0.6)",
			"level3Font": "rgba(255, 255, 255, 0.34)",
			"primaryBorder": "rgba(255, 255, 255, 0.16)",
			"secondaryBorder": "rgba(255, 255, 255, 0.09)",
			"primaryBackground": "#010b0b",
			"secondaryBackground": "#0c1717",
			"lv3Background": "#112727",
			"lv4Background": "rgba(255, 255, 255, 0.12)",
			"navBackground": "#0c1717",
			"navFont": "rgba(255, 255, 255, 0.6)",
			"navHoverFont": "#fff",
			"scanResTopMainFont": "#fff",
			"scanResTopSubFont": "rgba(255, 255, 255, 0.3)",
			"scanResTopIcon": "rgba(255, 255, 255, 0.06)",
			"navOtherFont": "rgba(255, 255, 255, 0.7)",
			"primaryIcon": "rgba(255, 255, 255, 0.2)",
			"chartColors": [
				"rgba(0, 188, 60, 1)",
				"rgba(0, 188, 60, 0.6)",
				"rgba(0, 188, 60, 0.4)",
				"rgba(0, 188, 60, 0.2)",
				"rgba(0, 188, 60, 0.1)"
			],
			"leftNavBgImg": "url(static/img/theme/left-nav-bg-matrix.png)",
			"rightBgImg": "url(static/img/theme/right-bg-matrix.png)",
			"navSelectBackground": "#010606",
			"entranceImg": "static/img/theme/The Matrix.png"
		}
		let userConfigJson = require(rootPathData + '/config/config.json');
		if (!userConfigJson.theme) {
			userConfigJson.theme = {};
		}
		userConfigJson.theme[name] = config;
		userConfigJson.curTheme = name;
		setTheme(config);
		let mergeConfigJson = JSON.stringify(userConfigJson, null, 6);
		fs.writeFileSync(rootPathData + '/config/config.json', mergeConfigJson);
	});
}

exports.activate = activate;