function computed(num,alpha){
    return Math.floor(num * alpha + 255 * (1 - alpha));
}
module.exports = function(color,alpha){
    return `rgb(${computed(color[0],alpha)},${computed(color[1],alpha)},${computed(color[2],alpha)})`;
}
