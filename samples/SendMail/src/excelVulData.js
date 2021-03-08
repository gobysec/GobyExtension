function vulListData(data){
    let arr1 = [];
        data.forEach((val, key) => {
          if (val.lists) {
            arr1 = arr1.concat(val.lists);
          }
        })

        let arr = [
          ["filename", "level", "hostinfo", "vulurl", "keymemo"]
        ];

        arr1.forEach((v, k) => {
          let arrItem = [v.filename];
          if (v.level == 0) {
            arrItem.push("Low");
          } else if (v.level == 1) {
            arrItem.push("Medium");
          } else if (v.level == 2) {
            arrItem.push("High");
          } else if (v.level == 3) {
            arrItem.push("Critical");
          }
          if (v.hostinfo) {
            arrItem.push(v.hostinfo);
          } else {
            arrItem.push("-");
          }
          if (v.vulurl) {
            arrItem.push(v.vulurl);
          } else {
            arrItem.push("-");
          }
          if (v.keymemo) {
            arrItem.push(v.keymemo);
          } else {
            arrItem.push("-");
          }
          arr.push(arrItem);
        })

        return arr;
}
module.exports=function(data){
    let obj={};
    data.filter(v=>v.vulnerabilities).forEach((v,k) => {
        v.vulnerabilities.forEach((value,key)=>{
            if(obj[value.name]){
                obj[value.name].lists.push(value);
                obj[value.name].nums++;
            }else{
                obj[value.name]={
                    lists:[
                        value
                    ],
                    name:value.name,
                    nums:1
                }
            }
        })
    });
    return vulListData(Object.values(obj));
}