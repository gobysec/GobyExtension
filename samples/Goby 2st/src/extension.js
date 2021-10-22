function activate(content) {
	var fs = require('fs');
	var path = require('path');
	// fs.watch(rootPathData + '/config/config.json',(event,filename)=>{
	// 	let config = require(rootPathData + '/config/config.json');
	// 	if(config.curTheme=="Goby 2st"){
	// 		$("main").css({
	// 			"background-size":"100% 100%"
	// 		})
	// 	}
	// })
	let config = require(rootPathData + '/config/config.json');
	// if(config.curTheme=="Goby 2st"){
	// 	$("main").css({
	// 		"background-size":"100% 100%"
	// 	})
	// }
	goby.registerCommand('init', function (content) {
		// 主题名字
		let name = "Goby 2st";
		// 主题配置
		let config = {
			"main": "#f5a556",
			"primaryFont": "rgba(255, 255, 255, 0.87)",
			"secondaryFont": "rgba(255, 255, 255, 0.6)",
			"level3Font": "rgba(255, 255, 255, 0.34)",
			"primaryBorder": "rgba(255, 255, 255, 0.16)",
			"secondaryBorder": "rgba(255, 255, 255, 0.09)",
			"primaryBackground": "#13264a",
			"secondaryBackground": "#1a3262",
			"lv3Background": "#1b3569",
			"lv4Background": "rgba(255, 255, 255, 0.12)",
			"navBackground": "#1a3262",
			"navFont": "rgba(255, 255, 255, 0.6)",
			"navHoverFont": "#fff",
			"scanResTopMainFont": "#fff",
			"scanResTopSubFont": "rgba(255, 255, 255, 0.3)",
			"scanResTopIcon": "rgba(255, 255, 255, 0.06)",
			"navOtherFont": "rgba(255, 255, 255, 0.7)",
			"primaryIcon": "rgba(255, 255, 255, 0.2)",
			"chartColors": [
				"rgba(245, 165, 86, 1)",
				"rgba(245, 165, 86, 0.6)",
				"rgba(245, 165, 86, 0.4)",
				"rgba(245, 165, 86, 0.2)",
				"rgba(245, 165, 86, 0.1)"
			],
			"leftNavBgImg": `url(${path.join(__dirname,'/img/left-Goby 2st.png').replace(new RegExp(/(\\)/g), '/')})`,
      		"rightBgImg": `url(${path.join(__dirname,'/img/right-Goby 2st.png').replace(new RegExp(/(\\)/g), '/')})`,
			"navSelectBackground": "#0e2143",
			"entranceImg": `${path.join(__dirname,'/img/entranceImg.png')}`,
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