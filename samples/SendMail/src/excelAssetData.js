function assetListData(ipsData){
    ipsData.forEach((val, key) => {
        let firstLvData = [];
        let secLvData = [];
        let thrLvData = [];
        let fourLvData = [];
        let fiveLvData = [];
        ipsData[key]['imgUrl'] = [];
        if (val.protocols && val.favicons) {
          for (var i in val.protocols) {
            if (i.indexOf("https://") != -1 || i.indexOf("http://") != -1) {
              let newI = i.replace('https://', '').replace('http://', '');
              val.protocols[newI] = val.protocols[i];
              delete val.protocols[i];
            }
          }

          val.favicons.forEach((fV, fK) => {
            if (val.protocols[fV.hostinfo]) {
              val.protocols[fV.hostinfo].imgpath = fV.imgpath;
            }
          })
        }

        if (val.tags) {
          val.tags.forEach((value, iKey) => {
            let obj = {};
            obj.title = value.product;
            obj.company = value.company;
            if (value.soft_hard == 1) {
              obj.softHardCode = '硬件';
              if (value.parent_category == 'Server' || value.category == 'Server') {
                ipsData[key].imgUrl.push('fuwuqi');
              } else if (value.parent_category == 'Router' || value.category == 'Router') {
                ipsData[key].imgUrl.push('luyouqi');
              } else if (value.parent_category == 'Switch' || value.category == 'Switch') {
                ipsData[key].imgUrl.push('jiaohuanji');
              } else if (value.parent_category == 'ADSL' || value.category == 'ADSL') {
                ipsData[key].imgUrl.push('adsl');
              } else if (value.parent_category == 'Wireless Network' || value.category == 'Wireless Network') {
                ipsData[key].imgUrl.push('wuxianwangluo');
              } else if (value.parent_category == 'Network Security' || value.category == 'Network Security') {
                ipsData[key].imgUrl.push('anquanchanpin');
              } else if (value.parent_category == 'Cameras and Surveillance' || value.category == 'Cameras and Surveillance') {
                ipsData[key].imgUrl.push('shipinjiankong');
              } else if (value.parent_category == 'Multifunctional' || value.category == 'Multifunctional') {
                ipsData[key].imgUrl.push('yitiji');
              } else if (value.parent_category == 'Printer' || value.category == 'Printer') {
                ipsData[key].imgUrl.push('dayinji');
              } else if (value.parent_category == 'Copier' || value.category == 'Copier') {
                ipsData[key].imgUrl.push('fuyinji');
              } else if (value.parent_category == 'Scanner' || value.category == 'Scanner') {
                ipsData[key].imgUrl.push('saomiaoyi');
              } else if (value.parent_category == 'Fax Machine' || value.category == 'Fax Machine') {
                ipsData[key].imgUrl.push('chuanzhenji');
              }
            } else if (value.soft_hard_code == 2) {
              obj.softHardCode = '软件';
            } else if (value.soft_hard_code == 0) {
              obj.softHardCode = '未定义';
            }
            obj.firstCatTag = value.parent_category;
            obj.secondCatTag = value.category;
            if (value.level == 4) {
              // 应用层
              firstLvData.push(obj);
            } else if (value.level == 3) {
              // 服务层
              secLvData.push(obj);
            } else if (value.level == 2) {
              // 系统层
              thrLvData.push(obj);
            } else if (value.level == 1) {
              // 硬件层
              fourLvData.push(obj);
            } else if (value.level == 5) {
              // 新增 支撑层
              fiveLvData.push(obj);
            }
          })
          ipsData[key]['firstLvData'] = firstLvData;
          ipsData[key]['secLvData'] = secLvData;
          ipsData[key]['thrLvData'] = thrLvData;
          ipsData[key]['fourLvData'] = fourLvData;
          ipsData[key]['fiveLvData'] = fiveLvData;
        } else {
          ipsData[key]['firstLvData'] = [];
          ipsData[key]['secLvData'] = [];
          ipsData[key]['thrLvData'] = [];
          ipsData[key]['fourLvData'] = [];
          ipsData[key]['fiveLvData'] = [];
        }

        // 处理ports和protocols
        val.protocols = handlePortsProtocols(val.ports, val.protocols);
      })
      return ipsData;
}
function handlePortsProtocols(ports, protocols) {
    // 可能为null
    if (!ports) {
      ports = [];
    }
    if (!protocols) {
      protocols = {};
    }
    
    // 计算属性可能会多次触发这个函数
    if (Object.keys(protocols).length > 0 && Object.keys(protocols)[0] == 0) {
      return protocols;
    } else {
      let protocolsObj = {};
      for (var i in protocols) {
        let port = i.split(":")[1];
        protocolsObj[port] = protocols[i];
      }
      ports.forEach((v, k) => {
        if (!protocolsObj[v.port]) {
          protocolsObj[v.port] = {
            "port": v.port,
            "protocol": ""
          }
        } 
      })

      let tempProtocolsArr = [];
      for (var i in protocolsObj) {
        tempProtocolsArr.push(protocolsObj[i]);
      }
      function protocolSort(x, y) {
        let value1 = x.protocol;
        let value2 = y.protocol;
        if (value2 < value1) {
          return 1;
        } else if (value2 > value1) {
          return -1;
        } else {
          return 0;
        }
      }
      tempProtocolsArr = tempProtocolsArr.sort(protocolSort).reverse();

      let returnProtocolsObj = {};
      tempProtocolsArr.forEach((v, k) => {
        if (!v.protocol) {
          v.protocol = "unknow";
        }
        returnProtocolsObj[k] = v;
      })
      return returnProtocolsObj;
    }
  }
module.exports=function(assetListDatas){
    let arr = [
        ["IP", "Port", "Protocol", "Mac", "Host", "Application Layer", "Support Layer", "Service Layer", "System Layer", "Hardware Layer"]
      ];
      
      assetListData(assetListDatas).forEach((v, k) => {
        let arrItem = [v.ip];
        if (v.protocols && Object.keys(v.protocols).length > 0) {
          let ports = [];
          let protocols = [];
          for (var i in v.protocols) {
            ports.push(v.protocols[i].port);
            protocols.push(v.protocols[i].protocol);
          }
          arrItem.push(String(ports));
          arrItem.push(String(protocols));
        } else {
          arrItem.push("-");
          arrItem.push("-");
        }

        if (v.mac) {
          arrItem.push(v.mac);
        } else {
          arrItem.push("-");
        }

        if (v.hostname) {
          arrItem.push(String(v.hostname));
        } else {
          arrItem.push("-");
        }

        if (v.fiveLvData && v.fiveLvData.length > 0) {
          let fi = [];
          v.fiveLvData.forEach((fiV, fiK) => {
            fi.push(fiV.title);
          })
          arrItem.push(String(fi));
        } else {
          arrItem.push("-");
        }

        if (v.firstLvData && v.firstLvData.length > 0) {
          let f = [];
          v.firstLvData.forEach((fV, fK) => {
            f.push(fV.title);
          })
          arrItem.push(String(f));
        } else {
          arrItem.push("-");
        }

        if (v.secLvData && v.secLvData.length > 0) {
          let s = [];
          v.secLvData.forEach((sV, sK) => {
            s.push(sV.title);
          })
          arrItem.push(String(s));
        } else {
          arrItem.push("-");
        }

        if (v.thrLvData && v.thrLvData.length > 0) {
          let t = [];
          v.thrLvData.forEach((tV, tK) => {
            t.push(tV.title);
          })
          arrItem.push(String(t));
        } else {
          arrItem.push("-");
        }

        if (v.fourLvData && v.fourLvData.length > 0) {
          let fo = [];
          v.fourLvData.forEach((foV, foK) => {
            fo.push(foV.title);
          })
          arrItem.push(String(fo));
        } else {
          arrItem.push("-");
        }

        arr.push(arrItem);
      })
      return arr;
}