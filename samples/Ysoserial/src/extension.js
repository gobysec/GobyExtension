function activate (content) {
    const path = require('path')

    goby.registerCommand('expDia',function(){
        goby.showIframeDia(path.join(__dirname,`assets/index.html?type=1`),'Ysoserial','600','500');
    })

    goby.registerCommand('toolbar',function(){
        goby.showIframeDia(path.join(__dirname,`assets/index.html?type=2`),'Ysoserial','600','500');
    })

    goby.registerCommand('isShow', function(content){
        return content?.expparams?.some(item=>item.name=='AttackType' && item.selVal.startsWith('yso'))
    })
}

exports.activate = activate;