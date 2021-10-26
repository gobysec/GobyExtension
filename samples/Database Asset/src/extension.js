
function activate(content) {
	
	goby.registerCommand('openDatabase',function(){
		goby.showPage('./assets/index.html',true);	
		
	})
}

exports.activate = activate;
