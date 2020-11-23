
function activate(content) {
	
	goby.registerCommand('left-nav',function(){
		goby.showPage('./assets/index.html',true);	
		
	})
}

exports.activate = activate;
