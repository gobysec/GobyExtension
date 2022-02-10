function activate(content) {
	let translate  = require(__dirname+'/assets/js/translate.js');
	
	goby.registerCommand('fofa', function(content){
		let email = goby.getConfiguration('Email');
		let key = goby.getConfiguration('Key');
		if (email && key) {
			let path = __dirname + "/fofa.html"
			let title = getTranslate('FOFA query');
			goby.showIframeDia(path,title , "666", "500");
		} else {
			goby.showConfigurationDia();
		}
	});

	goby.bindEvent('onChangeLang',()=>{
		let iframes = Array.from(document.querySelectorAll('#iframe-dia iframe'));
		let iframe = iframes.find((iframe)=>{
			return iframe.contentWindow.goby.id == goby.id;
		})
		iframe && changeLang(iframe);
	})

	function changeLang(iframe){
		let title = getTranslate('FOFA query')
		goby.showIframeDia(iframe.getAttribute('src'),title , "666", "500");
	}
	
	function getTranslate(key) {
		let lang = goby.getLang();
		try {
			let content = eval("translate[lang][key]");
			if(content == undefined){
				try {
					let content = eval("translate['EN'][key]");
					if(content == undefined){
						return key;
					}else{
						return content;
					}
				} catch (error) {
					console.log(error);
					return key;
				}
			}else{
				return content;
			}
		} catch (error) {
			try {
				let content = eval("translate['EN'][key]");
				if(content == undefined){
					return key;
				}else{
					return content;
				}
			} catch (error) {
				console.log(error);
				return key;
			}
		}
	}
}

exports.activate = activate;






