function activate(content) {
	var fs = require('fs');
	var path = require('path');
	fs.watch(rootPathData + '/config/config.json',(event,filename)=>{
		let config = require(rootPathData + '/config/config.json');
		if(config.curTheme=="Christmas 2020"){
			$("main").css({
				"background-size":"100% 100%"
			})
		}
	})
	let config = require(rootPathData + '/config/config.json');
	if(config.curTheme=="Christmas 2020"){
		$("main").css({
			"background-size":"100% 100%"
		})
	}
	goby.registerCommand('init', function (content) {
		// 主题名字
		let name = "Christmas 2020";
		// 主题配置
		let config = {
			"main": "#f4b325",
			"primaryFont": "rgba(255, 255, 255, 0.87)",
			"secondaryFont": "rgba(255, 255, 255, 0.6)",
			"level3Font": "rgba(255, 255, 255, 0.34)",
			"primaryBorder": "rgba(255, 255, 255, 0.16)",
			"secondaryBorder": "rgba(255, 255, 255, 0.09)",
			"primaryBackground": "#02383f",
			"secondaryBackground": "#126164",
			"lv3Background": "#17696c",
			"lv4Background": "rgba(255, 255, 255, 0.12)",
			"navBackground": "#126164",
			"navFont": "rgba(255, 255, 255, 0.6)",
			"navHoverFont": "#233229",
			"scanResTopMainFont": "#fff",
			"scanResTopSubFont": "rgba(255, 255, 255, 0.3)",
			"scanResTopIcon": "rgba(255, 255, 255, 0.06)",
			"navOtherFont": "rgba(255, 255, 255, 0.7)",
			"primaryIcon": "rgba(255, 255, 255, 0.2)",
			"chartColors": [
				"rgba(244,179,37, 1)",
				"rgba(244,179 ,37, 0.6)",
				"rgba(244,179,37, 0.4)",
				"rgba(244,179,37, 0.2)",
				"rgba(244,179,37, 0.1)"
			],
			"leftNavBgImg": `url(${path.join(__dirname,'/img/left.png').replace(new RegExp(/(\\)/g), '/')})`,
			"rightBgImg": `url(${path.join(__dirname,'/img/right.png').replace(new RegExp(/(\\)/g), '/')})`,
			"navSelectBackground": "#00262b",
			"entranceImg": path.join(__dirname,'/img/Christmas.png')
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