function activate(content) {
	var newPage = null;
	
	goby.registerCommand('subDomainsBrute',  function () {
		// let path = __dirname + "/index.html?curDirname=" + __dirname;
		// goby.showIframeDia(path, "子域名爆破", "666", "500");
		if(!newPage){
			message();
		}else{
			if(!newPage.location){
				message();
			}
		}
	});
	window.addEventListener('message',(event)=>{
		if(event.data.target=='subDomainsBrute'){
			newPage.postMessage({
				target:event.data.api,
				info:goby[event.data.api](...event.data.val)
			});
		}
	},false)
	function message(){
		let path = __dirname + "/index.html?curDirname=" + __dirname;
		newPage = window.open(path,'','width=666,height=520,resizable=no');
		console.log(newPage);
	}
}

exports.activate = activate;