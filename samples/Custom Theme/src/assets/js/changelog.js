const fs = require('fs'),
    path = require('path');

module.exports = function(content){
    return new Promise((resolve,reject)=>{
        
        if(!content || !content.trim()){
            reject({
                code:5,
                err:'NO CHANGELOG',
                message:'NO CHANGELOG'
            });
            return;
        }
        fs.writeFile(path.join(__dirname,'../../Theme/Theme/CHANGELOG.md'),content,(err)=>{
            if(err){
                reject({
                    code:5,
                    err,
                    message:'CHANGELOG.md error'
                });
                return;
            }
            resolve({
                code:200,
                message:'Success'
            });
        })
        
            
    })
}
