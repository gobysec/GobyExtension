function activate (content) {
    goby.registerCommand('openDevTools', function (content) {
        // require('electron').remote.getCurrentWindow().toggleDevTools();
        if(!require('electron').remote.getCurrentWindow().isDevToolsOpened()){
            // console.clear();
            require('electron').remote.getCurrentWindow().openDevTools();
        }else{
            goby.showInformationMessage('Debug已经打开，无需再次打开。')
        }
    });
}

exports.activate = activate;