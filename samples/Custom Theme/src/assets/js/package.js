const fs = require('fs'),
    path = require('path');

module.exports = function(content){
    return new Promise((resolve,reject)=>{
        let package = require(path.join(__dirname,'../../template/package.json'));
        for(let i in content){
            package[i] = content[i];
        }
        fs.writeFile(path.join(__dirname,'../../Theme/Theme/package.json'),JSON.stringify(package,null,6),(err)=>{
            if(err){
                reject({
                    code:3,
                    message:'package.json error',
                    err
                });
                return;
            }
            resolve({
                code:200,
                message:'Success'
            })
        })
    })
    
}
