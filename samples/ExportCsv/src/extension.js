function activate(content) {	
	goby.registerCommand('ExportCsv', function () {
		let path = __dirname + "/index.html"
		goby.showIframeDia(path, "导出", "334", "210");
	});
}

exports.activate = activate;