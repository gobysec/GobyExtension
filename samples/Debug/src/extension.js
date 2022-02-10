function activate (content) {
	const remote = top.require('@electron/remote')
    goby.registerCommand('openDevTools', function (content) {
        // require('electron').remote.getCurrentWindow().toggleDevTools();
        if(!remote.getCurrentWindow().isDevToolsOpened()){
            // console.clear();
            remote.getCurrentWindow().openDevTools();
        }else{
            goby.showInformationMessage('Debug has been opened, there is no need to open it again.')
        }
    });
}

exports.activate = activate;