function activate(content) {
	var fs = require('fs');
	var path = require('path');
	goby.registerCommand('init', function (content) {
		// 主题名字
		let name = 'Dao Master';
		// 主题配置
		let config = {
      "main": "rgba(70, 194, 225, 1)",
      "primaryFont": "rgba(255, 255, 255, 0.87)",
      "secondaryFont": "rgba(255, 255, 255, 0.6)",
      "level3Font": "rgba(255, 255, 255, 0.34)",
      "primaryBorder": "rgba(255, 255, 255, 0.16)",
      "secondaryBorder": "rgba(255, 255, 255, 0.09)",
      "primaryBackground": "rgba(6, 28, 58, 1)",
      "secondaryBackground": "rgba(6, 38, 83, 0.6)",
      "lv3Background": "rgb(10, 42, 86)",
      "lv4Background": "rgba(255, 255, 255, 0.12)",
      "navBackground": "rgba(255, 255, 255, 0.03)",
      "scanResTopMainFont": "rgb(255, 255, 255)",
      "scanResTopSubFont": "rgba(255, 255, 255, 0.3)",
      "scanResTopIcon": "rgba(255, 255, 255, 0.06)",
      "navOtherFont": "rgba(255, 255, 255, 0.7)",
      "primaryIcon": "rgba(255, 255, 255, 0.2)",
      "chartColors": [
            "rgb(70, 194, 225)",
            "rgba(70, 194, 225, 0.6)",
            "rgba(70, 194, 225, 0.4)",
            "rgba(70, 194, 225, 0.2)",
            "rgba(70, 194, 225, 0.1)"
      ],
      "leftNavBgImg": `url(${path.join(__dirname,'/img/leftNavBgImg.png').replace(new RegExp(/(\\)/g), '/')})`,
      "rightBgImg": `url(${path.join(__dirname,'/img/rightBgImg.png').replace(new RegExp(/(\\)/g), '/')})`,
      "navSelectBackground": "rgba(6, 28, 58, 0.53)",
      "entranceImg": `${path.join(__dirname,'/img/entranceImg.png')}`,
      "navFont": "rgba(255, 255, 255, 0.6)",
      "navHoverFont": "rgb(255, 255, 255)"
};
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
