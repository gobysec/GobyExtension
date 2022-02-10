const fs = require('fs'),
    path = require('path'),
    htmlTranslate = 'html.json';
let dirArr = fs.readdirSync(path.join(__dirname,'../translate'));


module.exports = dirArr.reduce((total,prev)=>{
    let fileStat = fs.statSync(path.join(__dirname,'../translate/',prev));
    if (fileStat.isDirectory() && fs.existsSync(path.join(__dirname,'../translate/',prev,htmlTranslate))) {
        try {
            const content = require(path.join(__dirname,'../translate/',prev,htmlTranslate));
            total[prev] = content;
        } catch (error) {
            console.error(error);
            // goby.showErrorMessage(error);
        }
        return total;
    }else{
        return total;
    }
},{})