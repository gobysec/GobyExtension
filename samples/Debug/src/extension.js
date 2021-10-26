function activate (content) {
    goby.registerCommand('openDevTools', function (content) {
        // require('electron').remote.getCurrentWindow().toggleDevTools();
        if(!require('electron').remote.getCurrentWindow().isDevToolsOpened()){
            // console.clear();
            require('electron').remote.getCurrentWindow().openDevTools();
        }else{
            goby.showInformationMessage('Debug has been opened, there is no need to open it again.')
        }
    });
}

exports.activate = activate;