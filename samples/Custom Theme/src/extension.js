function activate(content) {
	const path = require('path');
	var newPage = null;
	goby.registerCommand('ThemeDevelop', function () {
		
		if(!newPage){
			newPage = window.open(path.join(__dirname,'./index.html'),'Custom theme','width=620,height=655,resizable=no');
		}else{
			if(!newPage.location){
				newPage = window.open(path.join(__dirname,'./index.html'),'Custom theme','width=620,height=655,resizable=no');
			}
		}
	});
	window.addEventListener('message',(event)=>{
		if(event.data.target=='ThemeDevelop'){
			switch (event.data.operate) {
				case 'setColor':
					document.documentElement.style.setProperty(event.data.key, event.data.color);
					break;
				case 'getConfig':
					let config = goby.getConfiguration();
					newPage.postMessage({
						target:'ThemeDevelop',
						operate:'getConfig',
						config
					})
					break;
				case 'getTheme':
					newPage.postMessage({
						target:'ThemeDevelop',
						operate:'getTheme',
						theme:document.querySelector(':root').style.cssText
					})
					break;
				case 'exit':
					newPage.close();
					let configs = require(configPath);
					setTheme(configs['theme'][configs['curTheme']]); 
					break;
				default:
					break;
			}
			
		}
	},false)
}

exports.activate = activate;
