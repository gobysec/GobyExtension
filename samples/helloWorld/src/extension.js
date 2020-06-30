function activate (content) {
    goby.registerCommand('hello', function (content) {
        goby.showInformationMessage("helloWorld");
    });
}

exports.activate = activate;