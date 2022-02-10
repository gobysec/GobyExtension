const fs = require('fs'),
    path = require('path');

module.exports = function(content){
    return new Promise((resolve,reject)=>{
        if(!content || !content.trim()){
            reject({
                code:500,
                message:'NO README',
                err:'NO README'
            })
            return;
        }
        fs.writeFile(path.join(__dirname,'../../Theme/Theme/README.md'),content,(err)=>{
            if(err){
                reject({
                    code:4,
                    err,
                    message:'README.md error'
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
