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

module.exports = {ReplaceClassName, InStrSlice,randomRange}
