const fs = require('fs'),
    path = require('path'),
    replace = require('./replace.js');
function lrimg(name){
    return "url(${path.join(__dirname,\'/img/"+name+"\').replace(new RegExp(/(\\\\)/g), '/')})"
}
function entranceImg(name){
    return "${path.join(__dirname,\'/img/"+name+"\')}"
}
module.exports = function(Theme,img,name){
    return new Promise((resolve,reject)=>{
        let extension = fs.readFile(path.join(__dirname,'../../template/src/extension.js'),'utf8',(err,data)=>{
            if(err){
                reject({
                    code:1,
                    message:'extension.js error',
                    err
                });
                return;
            }
            
            let content = replace(/{{config}}/ig,data,JSON.stringify(Theme,null,6));
            content = replace(/{{name}}/ig,content,name);
            content = replace(/"{{/ig,content,"`{{");
            content = replace(/}}"/ig,content,"}}`");
            content = replace(/"url/ig,content,"`url");
            content = replace(/{{leftNavBgImg}}/ig,content,img[0].data?lrimg(img[0].data):'none');
            content = replace(/{{rightBgImg}}/ig,content,img[1].data?lrimg(img[1].data):'none');
            content = replace(/{{entranceImg}}/ig,content,img[2].data?entranceImg(img[2].data):'none');

            fs.writeFile(path.join(__dirname,'../../Theme/Theme/src/extension.js'),content,(error)=>{
                if(error){
                    reject({
                        code:2,
                        message:'extension.js error',
                        err:error
                    });
                    return;
                }
                resolve({
                    code:200,
                    message:'Success'
                });
            })
            
        });
    })
    
}
