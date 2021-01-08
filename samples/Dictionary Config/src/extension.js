function activate (content) {
    let path = require('path');
    goby.registerCommand('Dictionary Config', function (content) {
        goby.showIframeDia(path.join(__dirname,`assets/index.html?url=${__dirname}`),'Dictionary Config','600','500');
    });
}

exports.activate = activate;