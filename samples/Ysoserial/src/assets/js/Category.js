export default {
  0: [
    {
      "name": "File Name",
      "type": "input",
      "default": "",
      "require": true
    },
    {
      "name": "File Content",
      "type": "textarea",
      "default": "",
      "require": true
    }
  ],
  1: [
    {
      "name": "Command Execution",
      "type": "input",
      "default": "",
      "require": true
    }
  ],
  2: [
    {
      "name": "URL",
      "type": "input",
      "default": "",
      "require": true
    },
    {
      "name": "Class",
      "type": "input",
      "default": "",
      "require": true
    }
  ],
  3: [
    {
      "name": "Category",
      "type": "select",
      "default": "remoteJar",
      "require": true,
      "select_list": [
        {
          "label": "remoteJar",
          "value": "remoteJar",
          "tooltips": "remoteJar"
        },
        {
          "label": "writeJar",
          "value": "writeJar"
        },
        {
          "label": "localJar",
          "value": "localJar"
        },
        {
          "label": "c3p0Double",
          "value": "c3p0Double"
        },
        {
          "label": "c3p0Jndi",
          "value": "c3p0Jndi"
        },
        {
          "label": "jndi",
          "value": "jndi"
        }
      ]
    },
    {
      "name": "Class",
      "type": "input",
      "default": "",
      "require": true,
    }
  ],
  4: [
    {
      "name": "Category",
      "type": "select",
      "default": "TS-",
      "require": true,
      "select_list": [
        {
          "label": "Thread Sleep",
          "value": "TS-"
        },
        {
          "label": "Remote Class",
          "value": "RC-"
        },
        {
          "label": "Write File",
          "value": "WF-"
        },
        {
          "label": "Command Execution",
          "value": ""
        }
      ]
    },
    {
      "name": "Params",
      "type": "input",
      "default": "",
      "require": true,
    }
  ],
  5: [
    {
      "name": "Category",
      "type": "select",
      "default": "CE",
      "require": true,
      "select_list": [
        {
          "label": "Command Execution",
          "value": "CE"
        },
        {
          "label": "Local File",
          "value": "LF"
        },
        {
          "label": "Memory Shell",
          "value": "EX-MS"
        }
      ]
    },
    {
      "name": "Command",
      "type": "input",
      "default": "",
      "require": true,
      "show": {
        "Category": "CE"
      }
    },
    {
      "name": "File Path",
      "type": "input",
      "default": "",
      "require": true,
      "show": {
        "Category": "LF"
      }
    },
    {
      "name": "Memory Shell Category",
      "type": "select",
      "default": "SpringInterceptorMS",
      "require": true,
      "show": {
        "Category": "EX-MS"
      },
      "select_list": [
        {
          "label": "SpringInterceptorMS",
          "value": "SpringInterceptorMS",
          "tooltip": "Spring Interceptor 型内存马"
        },
        {
          "label": "TFMSFromJMX",
          "value": "TFMSFromJMX",
          "tooltip": "Tomcat Filter 型内存马（从 JmxMBeanServer 获取）"
        },
        {
          "label": "TFMSFromThread",
          "value": "TFMSFromThread",
          "tooltip": "Tomcat Filter 型内存马（从全局类加载器获取）"
        },
        {
          "label": "TFMSFromRequest",
          "value": "TFMSFromRequest",
          "tooltip": "遍历线程组在 request 中查找带有特定 Referer 的请求，并从中获取 ServletContext 添加 Filter 型内存马"
        },
        {
          "label": "TLMSFromThread",
          "value": "TLMSFromThread",
          "tooltip": "Tomcat Listener 型内存马（从全局类加载器获取）"
        },
        {
          "label": "TLMSFromJMX",
          "value": "TLMSFromJMX"
        },
        {
          "label": "TSMSFromJMX",
          "value": "TSMSFromJMX",
          "tooltip": "Tomcat Servlet 型内存马（从 JmxMBeanServer 获取）"
        },
        {
          "label": "TSMSFromThread",
          "value": "TSMSFromThread",
          "tooltip": "Tomcat Servlet 型内存马（从全局类加载器获取）"
        },
        {
          "label": "TSMSFromRequest",
          "value": "TSMSFromRequest",
          "tooltip": "遍历线程组在 request 中查找带有特定 Referer 的请求，并从中获取 ServletContext 添加 Servlet 型内存马"
        },
        {
          "label": "JBFMSFromContext",
          "value": "JBFMSFromContext",
          "tooltip": "JBoss Filter 型内存马"
        },
        {
          "label": "JBSMSFromContext",
          "value": "JBSMSFromContext",
          "tooltip": "JBoss Servlet 型内存马"
        },
        {
          "label": "JFMSFromJMX",
          "value": "JFMSFromJMX",
          "tooltip": "Jetty Filter 型内存马"
        },
        {
          "label": "JSMSFromJMX",
          "value": "JSMSFromJMX",
          "tooltip": "Jetty Servlet 型内存马"
        },
        {
          "label": "RFMSFromThread",
          "value": "RFMSFromThread",
          "tooltip": "Resin Filter 型内存马"
        },
        {
          "label": "RSMSFromThread",
          "value": "RSMSFromThread",
          "tooltip": "Resin Servlet 型内存马"
        },
        {
          "label": "WSFMSFromThread",
          "value": "WSFMSFromThread"
        },
        {
          "label": "RMIBindTemplate",
          "value": "RMIBindTemplate"
        },
        {
          "label": "TWSMSFromThread",
          "value": "TWSMSFromThread",
          "tooltip": "Tomcat Websocket 型内存马"
        },
        {
          "label": "TEXMSFromThread",
          "value": "TEXMSFromThread",
          "tooltip": "Tomcat Executor 内存马"
        },
        {
          "label": "TUGMSFromJMX",
          "value": "TUGMSFromJMX",
          "tooltip": "Tomcat Upgrade 型内存马"
        },
        {
          "label": "RMIBindTemplate-1100-su18",
          "value": "RMIBindTemplate-1100-su18"
        }
      ]
    },
    {
      "name": "Web Shell",
      "type": "select",
      "default": "bx",
      "require": true,
      "select_list": [
        {
          "label": "bx",
          "value": "bx",
          "tooltip": "冰蝎利用方式"
        },
        {
          "label": 'gz',
          "value": "gz",
          "tooltip": "哥斯拉 base64 利用方式"
        },
        {
          "label": "gzraw",
          "value": "gzraw",
          "tooltip": "哥斯拉 raw 利用方式"
        },
        {
          "label": "cmd",
          "value": "cmd",
          "tooltip": "命令执行回显利用方式"
        }
      ],
      "show": {
        "Category": "EX-MS"
      }
    },
    {
      "name": "URL",
      "type": "input",
      "require": true,
      "default": "/test",
      "show": {
        "Category": "EX-MS",
        "Web Shell": "bx"
      }
    },
    {
      "name": "PassWord",
      "type": "input",
      "require": true,
      "show": {
        "Category": "EX-MS",
        "Web Shell": "bx"
      }
    },
    {
      "name": "Referer",
      "type": "input",
      "require": true,
      "default": "https://baidu.com/",
      "show": {
        "Category": "EX-MS",
        "Web Shell": "bx"
      }
    },
    {
      "name": "URL",
      "type": "input",
      "require": true,
      "default": "/test",
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gz"
      }
    },
    {
      "name": "PassWord",
      "type": "input",
      "require": true,
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gz"
      }
    },
    {
      "name": "Referer",
      "type": "input",
      "default": "https://baidu.com/",
      "require": true,
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gz"
      }
    },
    {
      "name": "URL",
      "type": "input",
      "require": true,
      "default": "/test",
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gzraw"
      }
    },
    {
      "name": "PassWord",
      "type": "input",
      "require": true,
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gzraw"
      }
    },
    {
      "name": "Referer",
      "type": "input",
      "default": "https://baidu.com/",
      "require": true,
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gzraw"
      }
    }
  ],
  6: [
    {
      "name": "JNDI injection",
      "type": "input",
      "require": true,
    }
  ],
  7: [
    {
      "name": "Category",
      "type": "select",
      "default": "TS-",
      "require": true,
      "select_list": [
        {
          "label": "Thread Sleep sleep",
          "value": "TS-"
        },
        {
          "label": "Remote Jar",
          "value": "RJ-"
        },
        {
          "label": "Write File",
          "value": "WF-"
        },
        {
          "label": "ProcessBuilder",
          "value": "PB-"
        },
        {
          "label": "ScriptEngineManager",
          "value": "SE-"
        },
        {
          "label": "DNSLOG InetAddress Log",
          "value": "DL-"
        },
        {
          "label": "HTTPLOG URL",
          "value": "HL-"
        },
        {
          "label": "BCEL ClassLoader",
          "value": "BC-"
        },
        {
          "label": "JNDI",
          "value": "JD-"
        },
        {
          "label": "Command Execution",
          "value": ""
        },
        {
          "label": "Memory Shell",
          "value": "EX-MS"
        }
      ]
    },
    {
      "name": "Params",
      "type": "input",
      "require": true,
      "show": {
        "Category": "TS-"
      },
      "default": ""
    },
    {
      "name": "Params",
      "type": "input",
      "require": true,
      "show": {
        "Category": "RJ-"
      },
      "default": ""
    },
    {
      "name": "Params",
      "type": "input",
      "require": true,
      "show": {
        "Category": "WF-"
      },
      "default": ""
    },
    {
      "name": "Params",
      "type": "input",
      "require": true,
      "show": {
        "Category": "PB-"
      },
      "default": ""
    },
    {
      "name": "Params",
      "type": "input",
      "require": true,
      "show": {
        "Category": "SE-"
      },
      "default": ""
    },
    {
      "name": "Params",
      "type": "input",
      "require": true,
      "show": {
        "Category": "DL-"
      },
      "default": ""
    },
    {
      "name": "Params",
      "type": "input",
      "require": true,
      "show": {
        "Category": "HL-"
      },
      "default": ""
    },
    {
      "name": "Params",
      "type": "input",
      "require": true,
      "show": {
        "Category": "BC-"
      },
      "default": ""
    },
    {
      "name": "Params",
      "type": "input",
      "require": true,
      "show": {
        "Category": "JD-"
      },
      "default": ""
    },
    {
      "name": "Params",
      "type": "input",
      "require": true,
      "show": {
        "Category": ""
      },
      "default": ""
    },
    {
      "name": "Memory Shell Category",
      "type": "select",
      "default": "SpringInterceptorMS",
      "require": true,
      "show": {
        "Category": "EX-MS"
      },
      "select_list": [
        {
          "label": "SpringInterceptorMS",
          "value": "SpringInterceptorMS",
          "tooltip": "Spring Interceptor 型内存马"
        },
        {
          "label": "TFMSFromJMX",
          "value": "TFMSFromJMX",
          "tooltip": "Tomcat Filter 型内存马（从 JmxMBeanServer 获取）"
        },
        {
          "label": "TFMSFromThread",
          "value": "TFMSFromThread",
          "tooltip": "Tomcat Filter 型内存马（从全局类加载器获取）"
        },
        {
          "label": "TFMSFromRequest",
          "value": "TFMSFromRequest",
          "tooltip": "遍历线程组在 request 中查找带有特定 Referer 的请求，并从中获取 ServletContext 添加 Filter 型内存马"
        },
        {
          "label": "TLMSFromThread",
          "value": "TLMSFromThread",
          "tooltip": "Tomcat Listener 型内存马（从全局类加载器获取）"
        },
        {
          "label": "TLMSFromJMX",
          "value": "TLMSFromJMX"
        },
        {
          "label": "TSMSFromJMX",
          "value": "TSMSFromJMX",
          "tooltip": "Tomcat Servlet 型内存马（从 JmxMBeanServer 获取）"
        },
        {
          "label": "TSMSFromThread",
          "value": "TSMSFromThread",
          "tooltip": "Tomcat Servlet 型内存马（从全局类加载器获取）"
        },
        {
          "label": "TSMSFromRequest",
          "value": "TSMSFromRequest",
          "tooltip": "遍历线程组在 request 中查找带有特定 Referer 的请求，并从中获取 ServletContext 添加 Servlet 型内存马"
        },
        {
          "label": "JBFMSFromContext",
          "value": "JBFMSFromContext",
          "tooltip": "JBoss Filter 型内存马"
        },
        {
          "label": "JBSMSFromContext",
          "value": "JBSMSFromContext",
          "tooltip": "JBoss Servlet 型内存马"
        },
        {
          "label": "JFMSFromJMX",
          "value": "JFMSFromJMX",
          "tooltip": "Jetty Filter 型内存马"
        },
        {
          "label": "JSMSFromJMX",
          "value": "JSMSFromJMX",
          "tooltip": "Jetty Servlet 型内存马"
        },
        {
          "label": "RFMSFromThread",
          "value": "RFMSFromThread",
          "tooltip": "Resin Filter 型内存马"
        },
        {
          "label": "RSMSFromThread",
          "value": "RSMSFromThread",
          "tooltip": "Resin Servlet 型内存马"
        },
        {
          "label": "WSFMSFromThread",
          "value": "WSFMSFromThread"
        },
        {
          "label": "RMIBindTemplate",
          "value": "RMIBindTemplate"
        },
        {
          "label": "TWSMSFromThread",
          "value": "TWSMSFromThread",
          "tooltip": "Tomcat Websocket 型内存马"
        },
        {
          "label": "TEXMSFromThread",
          "value": "TEXMSFromThread",
          "tooltip": "Tomcat Executor 内存马"
        },
        {
          "label": "TUGMSFromJMX",
          "value": "TUGMSFromJMX",
          "tooltip": "Tomcat Upgrade 型内存马"
        },
        {
          "label": "RMIBindTemplate-1100-su18",
          "value": "RMIBindTemplate-1100-su18"
        }
      ]
    },
    {
      "name": "Web Shell",
      "type": "select",
      "default": "bx",
      "require": true,
      "select_list": [
        {
          "label": "bx",
          "value": "bx",
          "tooltip": "冰蝎利用方式"
        },
        {
          "label": 'gz',
          "value": "gz",
          "tooltip": "哥斯拉 base64 利用方式"
        },
        {
          "label": "gzraw",
          "value": "gzraw",
          "tooltip": "哥斯拉 raw 利用方式"
        },
        {
          "label": "cmd",
          "value": "cmd",
          "tooltip": "命令执行回显利用方式"
        }
      ],
      "show": {
        "Category": "EX-MS"
      }
    },
    {
      "name": "URL",
      "type": "input",
      "require": true,
      "default": "/test",
      "show": {
        "Category": "EX-MS",
        "Web Shell": "bx"
      }
    },
    {
      "name": "PassWord",
      "type": "input",
      "require": true,
      "show": {
        "Category": "EX-MS",
        "Web Shell": "bx"
      }
    },
    {
      "name": "Referer",
      "type": "input",
      "require": true,
      "default": "https://baidu.com/",
      "show": {
        "Category": "EX-MS",
        "Web Shell": "bx"
      }
    },
    {
      "name": "URL",
      "type": "input",
      "default": "/test",
      "require": true,
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gz"
      }
    },
    {
      "name": "PassWord",
      "type": "input",
      "require": true,
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gz"
      }
    },
    {
      "name": "Referer",
      "type": "input",
      "default": "https://baidu.com/",
      "require": true,
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gz"
      }
    },
    {
      "name": "URL",
      "type": "input",
      "require": true,
      "default": "/test",
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gzraw"
      }
    },
    {
      "name": "PassWord",
      "type": "input",
      "require": true,
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gzraw"
      }
    },
    {
      "name": "Referer",
      "type": "input",
      "default": "https://baidu.com/",
      "require": true,
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gzraw"
      }
    }
  ],
  8: [
    {
      "name": "Category",
      "type": "select",
      "require": true,
      "default": "copyAndDelete",
      "select_list": [
        {
          "label": "copyAndDelete",
          "value": "copyAndDelete"
        },
        {
          "label": "write",
          "value": "write"
        },
        {
          "label": "writeB64",
          "value": "writeB64"
        },
        {
          "label": "writeOld",
          "value": "writeOld"
        },
        {
          "label": "writeOldB64",
          "value": "writeOldB64"
        }
      ]
    },
    {
      "name": "Source File",
      "type": "input",
      "require": true,
      "default": "",
      "show": {
        "Category": "copyAndDelete"
      }
    },
    {
      "name": "Target Directory",
      "type": "input",
      "require": true,
      "default": "",
      "show": {
        "Category": "copyAndDelete"
      }
    },
    {
      "name": "Target Directory",
      "type": "input",
      "require": true,
      "default": "",
      "show": {
        "Category": "write"
      }
    },
    {
      "name": "ASCII Data",
      "type": "input",
      "require": true,
      "default": "",
      "show": {
        "Category": "write"
      }
    },
    {
      "name": "Target Directory",
      "type": "input",
      "require": true,
      "default": "",
      "show": {
        "Category": "writeB64"
      }
    },
    {
      "name": "Base64 Data",
      "type": "input",
      "require": true,
      "default": "",
      "show": {
        "Category": "writeB64"
      }
    },
    {
      "name": "Target File",
      "type": "input",
      "require": true,
      "default": "",
      "show": {
        "Category": "writeOld"
      }
    },
    {
      "name": "ASCII Data",
      "type": "input",
      "require": true,
      "default": "",
      "show": {
        "Category": "writeOld"
      }
    },
    {
      "name": "Target File",
      "type": "input",
      "require": true,
      "default": "",
      "show": {
        "Category": "writeOldB64"
      }
    },
    {
      "name": "Base64 Data",
      "type": "input",
      "require": true,
      "default": "",
      "show": {
        "Category": "writeOldB64"
      }
    }
  ],
  9: [
    {
      "name": "RMIConnector",
      "type": "input",
      "default": "",
      "require": true,
    }
  ],
  10: [

  ],
  11: [
    {
      "name": "Port",
      "type": "input",
      "default": "",
      "require": true,
    }
  ],
  12: [
    {
      "name": "Host",
      "type": "input",
      "default": "",
      "require": true,
    },
    {
      "name": "Port",
      "type": "input",
      "default": "",
      "require": true,
    }
  ],
  13: [
    {
      "name": "Category",
      "type": "select",
      "default": "CE",
      "require": true,
      "select_list": [
        {
          "label": "Command Execution",
          "value": "CE"
        },
        {
          "label": "Memory Shell",
          "value": "EX-MS"
        }
      ]
    },
    {
      "name": "Command",
      "type": "input",
      "default": "",
      "require": true,
      "show": {
        "Category": "CE"
      }
    },
    {
      "name": "Memory Shell Category",
      "type": "select",
      "default": "SpringInterceptorMS",
      "require": true,
      "show": {
        "Category": "EX-MS"
      },
      "select_list": [
        {
          "label": "SpringInterceptorMS",
          "value": "SpringInterceptorMS",
          "tooltip": "Spring Interceptor 型内存马"
        },
        
        {
          "label": "TLMSFromThread",
          "value": "TLMSFromThread",
          "tooltip": "Tomcat Listener 型内存马（从全局类加载器获取）"
        },
        {
          "label": "TLMSFromJMX",
          "value": "TLMSFromJMX"
        },
        {
          "label": "TSMSFromJMX",
          "value": "TSMSFromJMX",
          "tooltip": "Tomcat Servlet 型内存马（从 JmxMBeanServer 获取）"
        },
        {
          "label": "TSMSFromThread",
          "value": "TSMSFromThread",
          "tooltip": "Tomcat Servlet 型内存马（从全局类加载器获取）"
        },
        {
          "label": "TSMSFromRequest",
          "value": "TSMSFromRequest",
          "tooltip": "遍历线程组在 request 中查找带有特定 Referer 的请求，并从中获取 ServletContext 添加 Servlet 型内存马"
        },
        {
          "label": "JBFMSFromContext",
          "value": "JBFMSFromContext",
          "tooltip": "JBoss Filter 型内存马"
        },
        {
          "label": "JBSMSFromContext",
          "value": "JBSMSFromContext",
          "tooltip": "JBoss Servlet 型内存马"
        },
        {
          "label": "JFMSFromJMX",
          "value": "JFMSFromJMX",
          "tooltip": "Jetty Filter 型内存马"
        },
        {
          "label": "JSMSFromJMX",
          "value": "JSMSFromJMX",
          "tooltip": "Jetty Servlet 型内存马"
        },
        {
          "label": "RFMSFromThread",
          "value": "RFMSFromThread",
          "tooltip": "Resin Filter 型内存马"
        },
        {
          "label": "RSMSFromThread",
          "value": "RSMSFromThread",
          "tooltip": "Resin Servlet 型内存马"
        },
        {
          "label": "WSFMSFromThread",
          "value": "WSFMSFromThread"
        },
        {
          "label": "RMIBindTemplate",
          "value": "RMIBindTemplate"
        },
        {
          "label": "TWSMSFromThread",
          "value": "TWSMSFromThread",
          "tooltip": "Tomcat Websocket 型内存马"
        },
        {
          "label": "TEXMSFromThread",
          "value": "TEXMSFromThread",
          "tooltip": "Tomcat Executor 内存马"
        },
        {
          "label": "TUGMSFromJMX",
          "value": "TUGMSFromJMX",
          "tooltip": "Tomcat Upgrade 型内存马"
        },
        {
          "label": "RMIBindTemplate-1100-su18",
          "value": "RMIBindTemplate-1100-su18"
        }
      ]
    },
    {
      "name": "Web Shell",
      "type": "select",
      "default": "bx",
      "require": true,
      "select_list": [
        {
          "label": "bx",
          "value": "bx",
          "tooltip": "冰蝎利用方式"
        },
        {
          "label": 'gz',
          "value": "gz",
          "tooltip": "哥斯拉 base64 利用方式"
        },
        {
          "label": "gzraw",
          "value": "gzraw",
          "tooltip": "哥斯拉 raw 利用方式"
        },
        {
          "label": "cmd",
          "value": "cmd",
          "tooltip": "命令执行回显利用方式"
        }
      ],
      "show": {
        "Category": "EX-MS"
      }
    },
    {
      "name": "URL",
      "type": "input",
      "require": true,
      "default": "/test",
      "show": {
        "Category": "EX-MS",
        "Web Shell": "bx"
      }
    },
    {
      "name": "PassWord",
      "type": "input",
      "require": true,
      "show": {
        "Category": "EX-MS",
        "Web Shell": "bx"
      }
    },
    {
      "name": "Referer",
      "type": "input",
      "require": true,
      "default": "https://baidu.com/",
      "show": {
        "Category": "EX-MS",
        "Web Shell": "bx"
      }
    },
    {
      "name": "URL",
      "type": "input",
      "require": true,
      "default": "/test",
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gz"
      }
    },
    {
      "name": "PassWord",
      "type": "input",
      "require": true,
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gz"
      }
    },
    {
      "name": "Referer",
      "type": "input",
      "default": "https://baidu.com/",
      "require": true,
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gz"
      }
    },
    {
      "name": "URL",
      "type": "input",
      "require": true,
      "default": "/test",
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gzraw"
      }
    },
    {
      "name": "PassWord",
      "type": "input",
      "require": true,
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gzraw"
      }
    },
    {
      "name": "Referer",
      "type": "input",
      "default": "https://baidu.com/",
      "require": true,
      "show": {
        "Category": "EX-MS",
        "Web Shell": "gzraw"
      }
    }
  ],
  '-1': [
    {
      "name": "Inherit",
      "type": "radio",
      "default": false,
      "tooltip": "TemplatesImpl 利用方式恶意类是否继承 AbstractTranslet",
      "radio_list": [
        {
          "label": "Y",
          "value": true
        },
        {
          "label": "N",
          "value": false
        }
      ]
    },
    {
      "name": "Obscure",
      "type": "radio",
      "default": false,
      "tooltip": "是否使用混淆技术（unsafe / native 等方式）",
      "radio_list": [
        {
          "label": "Y",
          "value": true
        },
        {
          "label": "N",
          "value": false
        }
      ]
    },
    {
      "name": "Jboss",
      "type": "radio",
      "default": false,
      "tooltip": "结果是否以 JBossObjectOutputStream 格式输出",
      "radio_list": [
        {
          "label": "Y",
          "value": true
        },
        {
          "label": "N",
          "value": false
        }
      ]
    },
    // {
    //   "name": "Hide-mem-shell",
    //   "type": "radio",
    //   "default": false,
    //   "radio_list": [
    //     {
    //       "label": "Y",
    //       "value": true
    //     },
    //     {
    //       "label": "N",
    //       "value": false
    //     }
    //   ]
    // },
    {
      "name": "Dirty-type",
      "type": "select",
      "default": "",
      "tooltip": "插入脏数据类型",
      "select_list": [
        {
          "label": "Random Hashable Collections",
          "value": 1,
          "tooltip": "随机 Hashable Collections"
        },
        {
          "label": "LinkedList Nesting",
          "value": 2,
          "tooltip": "嵌套 LinkedList"
        },
        {
          "label": "TC_RESET in Serialized Data",
          "value": 3,
          "tooltip": "填充 TC_RESET"
        }
      ]
    },
    {
      "name": "Dirty-length",
      "type": "input",
      "default": "",
      "tooltip": "脏数据长度或嵌套层数"
    }
  ]
}
