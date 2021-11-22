function activate (content) {
    let translate  = require(__dirname+'/assets/js/translate.js');

    goby.registerCommand('Vulfocus', function (content) {
        let username = goby.getConfiguration('Username');
        let license = goby.getConfiguration('License');
        let usernameLocal = goby.getConfiguration('UsernameLocal');
        let licenseLocal = goby.getConfiguration('LicenseLocal');
        let vulAddressLocal = goby.getConfiguration('LocalVulAddress');

        if((username && license) || (usernameLocal && licenseLocal && vulAddressLocal)){
            let path = __dirname + "/Vulfocus.html";
            let title = "Vulfocus";
            goby.showIframeDia(path,title , "800", "500");
        } else {
            goby.showConfigurationDia();
        }

    });

    goby.bindEvent('onChangeLang',()=>{
        let iframes = Array.from(document.querySelectorAll('#iframe-dia iframe'));
        let iframe = iframes.find((iframe)=>{
            return iframe.contentWindow.goby.id == goby.id;
        })
        iframe && changeLang(iframe);
    })

    function changeLang(iframe){
        let title = getTranslate('Vulfocus');
        goby.showIframeDia(iframe.getAttribute('src'),title , "800", "500");
    }

    function getTranslate(key) {
        let lang = goby.getLang();
        try {
            let content = eval("translate[lang][key]");
            if(content == undefined){
                try {
                    let content = eval("translate['EN'][key]");
                    if(content == undefined){
                        return key;
                    }else{
                        return content;
                    }
                } catch (error) {
                    return key;
                }
            }else{
                return content;
            }
        } catch (error) {
            try {
                let content = eval("translate['EN'][key]");
                if(content == undefined){
                    return key;
                }else{
                    return content;
                }
            } catch (error) {
                console.log(error);
                return key;
            }
        }
    }
}
exports.activate = activate;