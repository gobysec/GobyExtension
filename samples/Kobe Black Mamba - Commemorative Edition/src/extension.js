function activate(content) {
	var fs = require('fs');
	var path = require('path');
	let leftNavBgImg = path.join(__dirname, "left-nav-bg-kobe.png").replace(new RegExp(/(\\)/g), '/');
	let rightBgImg = path.join(__dirname, "right-bg-kobe.png").replace(new RegExp(/(\\)/g), '/');
	
	goby.registerCommand('init', function (content) {
		// 主题名字
		let name = "Kobe Black Mamba - Commemorative Edition";
		// 主题配置
		let config = {
			"main": "#e6a429",
			"primaryFont": "rgba(255, 255, 255, 0.87)",
			"secondaryFont": "rgba(255, 255, 255, 0.6)",
			"level3Font": "rgba(255, 255, 255, 0.34)",
			"primaryBorder": "rgba(255, 255, 255, 0.16)",
			"secondaryBorder": "rgba(255, 255, 255, 0.09)",
			"primaryBackground": "#212126",
			"secondaryBackground": "#2f3035",
			"lv3Background": "#37383d",
			"lv4Background": "rgba(255, 255, 255, 0.12)",
			"navBackground": "#2f3035",
			"navFont": "rgba(255, 255, 255, 0.6)",
			"navHoverFont": "#fff",
			"scanResTopMainFont": "#fff",
			"scanResTopSubFont": "rgba(255, 255, 255, 0.3)",
			"scanResTopIcon": "rgba(255, 255, 255, 0.06)",
			"navOtherFont": "rgba(255, 255, 255, 0.7)",
			"primaryIcon": "rgba(255, 255, 255, 0.2)",
			"chartColors": [
				"rgba(229, 163, 41, 1)",
				"rgba(229, 163, 41, 0.6)",
				"rgba(229, 163, 41, 0.4)",
				"rgba(229, 163, 41, 0.2)",
				"rgba(229, 163, 41, 0.1)"
			],
			"leftNavBgImg": "url("+leftNavBgImg+")",
			"rightBgImg": "url("+rightBgImg+")",
			"navSelectBackground": "rgb(26, 26, 31)",
			"entranceImg": __dirname+"/kobe.png"
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