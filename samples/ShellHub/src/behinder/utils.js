const fs = require('fs')

function ReplaceClassName(classContent, protoName, newClassName) {

}


function InStrSlice(str, list) {
    for (let value of list) {
        if (value === str) {
            return true
        }
    }
    return false
}

function randomRange(min, max) {
    let returnStr = "",
        range = (max ? Math.round(Math.random() * (max - min)) + min : min),
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for (let i = 0; i < range; i++) {
        var index = Math.round(Math.random() * (arr.length - 1));
        returnStr += arr[index];
    }
    return returnStr;
}

function ExportRaw(name, data) {
    var urlObject = window.URL || window.webkitURL || window;
    var export_blob = new Blob([data]);
    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    fakeClick(save_link);
}

function fakeClick(obj) {
    var ev = document.createEvent("MouseEvents");
    ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    obj.dispatchEvent(ev);
}

function FileSplit(filePath, size) {
    let buffIndex = 0;
    let fileBuff;
    let buff = []
    try {
        fileBuff = fs.readFileSync(filePath);
    } catch (e) {
        return e
    }
    // 文件数据分段
    let buffLength = fileBuff.length;
    while (buffIndex <= buffLength) {
        let buffSplit = fileBuff.slice(buffIndex, buffIndex + size);
        buffIndex += size;
        buff.push(buffSplit);
    }
    console.log("分块的大小为: " + buff.length)
    return buff
}

// console.log(fileSplit("F:\\软件安装包\\AxureRP-Setup-3719.exe",46080))
module.exports = {ReplaceClassName, InStrSlice, randomRange, ExportRaw, FileSplit}
