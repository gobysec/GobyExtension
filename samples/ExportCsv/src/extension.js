function activate(content) {	
	goby.registerCommand('ExportCsv', function () {
		let path = __dirname + "/index.html"
		goby.showIframeDia(path, "Export", "334", "210");
	});
}

exports.activate = activate;