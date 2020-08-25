function activate(content) {
	var fs = require('fs');
	
	goby.registerCommand('init', function (content) {
		// 主题名字
		let name = "Crayon Shin-chan";
		// 主题配置
		let config = {
			"main": "#38835d",
			"primaryFont": "#233229",
			"secondaryFont": "#5b6563",
			"level3Font": "#b1b4a7",
			"primaryBorder": "#e2e7cf",
			"secondaryBorder": "#d5d7cf",
			"primaryBackground": "#e8efcd",
			"secondaryBackground": "#fcffee",
			"lv3Background": "#fefff9",
			"lv4Background": "rgba(56, 131, 96, 0.12)",
			"navBackground": "#fcffee",
			"navFont": "rgba(35, 50, 41, 0.7)",
			"navHoverFont": "#233229",
			"scanResTopMainFont": "#38835d",
			"scanResTopSubFont": "#b1b4a7",
			"scanResTopIcon": "rgba(56, 131, 96, 0.12)",
			"navOtherFont": "#5b6563",
			"primaryIcon": "rgba(56, 131, 96, 0.45)",
			"chartColors": [
				"rgba(56, 131, 93, 1)",
				"rgba(56, 131, 93, 0.6)",
				"rgba(56, 131, 93, 0.4)",
				"rgba(56, 131, 93, 0.2)",
				"rgba(56, 131, 93, 0.1)"
			],
			"leftNavBgImg": "url(static/img/theme/left-nav-bg-crayon.png)",
			"rightBgImg": "url(static/img/theme/right-bg-crayon.png)",
			"navSelectBackground": "#dfe7bf",
			"entranceImg": "static/img/theme/Crayon Shin-chan.png"
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