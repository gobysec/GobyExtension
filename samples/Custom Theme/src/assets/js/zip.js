const fs = require("fs");
const path = require("path");
const JSZIP = require("jszip");
const zip = new JSZIP();

const readDir = (obj, path) => {
  const files = fs.readdirSync(path); //读取目录中的所有文件及文件夹（同步操作）
  files.forEach((fileName, index) => {
    const fillPath = path + "/" + fileName;
    const file = fs.statSync(fillPath); //获取一个文件的属性
    if (file.isDirectory()) {
      const dirlist = obj.folder(fileName);
      readDir(dirlist, fillPath);
    } else {
      obj.file(fileName, fs.readFileSync(fillPath));//压缩目录添加文件
    }
  })
}
const delFile = (path) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
    console.log(path + ' 已删除');
  }
}

module.exports = (path, zipName) => {
	return new Promise((resolve,reject)=>{
      const resultFilePath = `${path}/${zipName}`
      delFile(resultFilePath)
      readDir(zip, path);
      zip.generateAsync({ //设置压缩格式，开始打包
        type: "nodebuffer", //nodejs用
        compression: "DEFLATE", //压缩算法
        compressionOptions: { //压缩级别
          level: 9
        }
      }).then(content => {
        resolve({
            code:200,
            message:'Success',
            data:content
        })
      }).catch((err)=>{
          reject({
              code:500,
              message:'zip error',
              err
          });
      })
	})
    
}
