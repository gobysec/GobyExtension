export default function ({method='GET', body=""}){
  let globalConfig = parent.globalConfig
  let godserver
  switch(globalConfig.godserverType){
      case 0:
          godserver = "https://gobygo.net"
          break;
      case 1:
          godserver = globalConfig.godserver
          break;
      default:
          godserver = "https://gobygo.net"
      
  }
  return fetch(`${godserver}/api/v1/ysoserial`, {
    method,
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body
  })
}
