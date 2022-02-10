const fs = require('fs'),
    path = require('path'),
    extname = [
        '.jpg',
        '.png',
        '.gif',
        '.svg',
        '.jpeg',
        '.webp',
        '.ico'
    ];

module.exports = function(filePath){
    return Promise.all(filePath.map(item=>{
        return new Promise((resolve,reject)=>{
            if(!item.path){
                resolve({
                    code:200,
                    message:'Success'
                });
                return;
            }
            let fileExtname = path.extname(item.path);
            if(!extname.includes(fileExtname)){
                reject({
                    code:500,
                    message:`${item.name} error`,
                    err:'File extname format error'
                })
                return;
            }
            fs.readFile(item.path,(err,data)=>{
                if(err){
                    reject({
                        code:500,
                        message:`${item.name} error`,
                        err
                    });
                    return;
                }
                fs.writeFile(path.join(__dirname,'../../Theme/Theme/src/img/',`${item.name}${path.extname(item.path)}`),data,(error)=>{
                    if(error){
                        reject({
                            code:500,
                            message:`${item.name} error`,
                            err
                        });
                        return;
                    }
                    resolve({
                        code:200,
                        message:'Success',
                        data:item.name + path.extname(item.path)
                    });
                });
            })
        })
    }))
}
