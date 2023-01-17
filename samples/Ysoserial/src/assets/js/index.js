import GadgetList from './Gadget.js'
import Category from './Category.js'
import E_FN_List from './E-fn.js'
import getpayLoad from './request.js'
let type = new URLSearchParams(location.search).get('type')
let parameters = Object.values(GadgetList).reduce((total, prev) => {
    return {
        ...total,
        [prev.value]: Category[prev.type].reduce((total1, prev1) => {

            return {
                ...total1,
                [prev1.name]: prev1.default
            }
        }, {})
    }
}, {})
let e_fn = Object.values(E_FN_List).reduce((total, prev) => {
    return {
        ...total,
        [prev.value]: Category[prev.type].reduce((total1, prev1) => {
            return {
                ...total1,
                [prev1.name]: prev1.default
            }
        }, {})
    }
}, {})
var app = new Vue({
    el: '#app',
    data() {
        return {
            type,
            goby: goby,
            path: parent.require('path'),
            fs: parent.require('fs'),
            util: parent.require('util'),
            gadget: "",
            GadgetList: Object.values(GadgetList),
            GadgetLists: Object.values(GadgetList),
            E_FN_List: Object.values(E_FN_List),
            Category,
            parameters,
            e_fn,
            Advanced: false,
            loading: false,
            payLoad: "",
            state: "",
            error: ""
        }
    },
    methods: {
        init() {
            this.gadget = this.GadgetList[0].value
            if (this.type == 1) {
                this.goby.getCurrentExpInfo(res => {
                    res.statusCode == 200 && (() => {
                        this.setParams(res?.data?.expparams || [])
                    })()
                })
            }
        },
        isShow(item, value) {
            if (typeof value.show == 'undefined') {
                return true
            }
            let showType = value.show?.constructor?.name
            switch (showType) {
                case 'Boolean':
                    return value.show
                    break;
                case 'String':
                    return value.show
                case 'Object':
                    let values = Object.entries(value.show)
                    return values.every(v => item[v[0]] == v[1])
                default:
                    return true
                    break;
            }
        },
        getParams() {
            let { model } = this.$refs.form[0]
            let params = {
                gadget: this.gadget,
                encoding: "base64"
            }
            this.e_fn.extension.Inherit && (params.inherit = this.e_fn.extension.Inherit)
            this.e_fn.extension.Obscure && (params.obscure = this.e_fn.extension.Obscure)
            this.e_fn.extension.Jboss && (params.jboss = this.e_fn.extension.Jboss)
            this.e_fn.extension['Dirty-type'] && (params.dirty_type = this.e_fn.extension['Dirty-type'])
            this.e_fn.extension['Dirty-length'] && (params.dirty_length = this.e_fn.extension['Dirty-length'])
            let errMessage = ""
            switch (this.currentGadget?.type) {
                case 0:
                    params.parameters = `${model['File Name']};${this.base64(model['File Content'])}`
                    break;
                case 1:
                    params.parameters = `${model['Command Execution']}`
                    break;
                case 2:
                    params.parameters = `${model['URL']}:${model['Class']}`
                    break;
                case 3:
                    params.parameters = `${model['Category']}-${model['Class']}`
                    break;
                case 4:
                    params.parameters = `${model['Category']}${model['Params']}`
                    break;
                case 5:
                case 13:
                    switch (model['Category']) {
                        case 'CE':
                            params.parameters = `${model['Command']}`
                            break;
                        case 'LF':
                            if (this.fs.existsSync(model['File Path'])) {
                                params.parameters = `${model['Category']}-${this.fs.readFileSync(model['File Path']).toString('base64')}`
                            } else {
                                errMessage = `ENOENT: no such file or directory, open '${model['File Path']}'`
                            }

                            break;
                        case 'EX-MS':
                            params.parameters = `${model['Category']}-${model['Memory Shell Category']}-${model['Web Shell']}`
                            if (model['Web Shell'] == 'cmd') {

                            } else {
                                params.url = model['URL']
                                params.password = model['PassWord']
                                params.referer = model['Referer']
                            }

                            break;
                        default:
                            break;
                    }
                    break;
                case 6:
                    params.parameters = model['JNDI injection']
                    break;
                case 7:
                    switch (model['Category']) {
                        case "EX-MS":
                            params.parameters = `${model['Category']}-${model['Memory Shell Category']}-${model['Web Shell']}`
                            if (model['Web Shell'] == 'cmd') {

                            } else {
                                params.url = model['URL']
                                params.password = model['PassWord']
                                params.referer = model['Referer']
                            }   
                            break;
                    
                        default:
                            params.parameters = `${model['Category']}${model['Params']}`
                            break;
                    }
                    
                    break;
                case 8:
                    switch (model['Category']) {
                        case 'copyAndDelete':
                            params.parameters = `${model['Source File']};${model['Target Directory']}`
                            break;

                        default:
                            break;
                    }
                    break;
                case 9:
                    params.parameters = this.base64(model['RMIConnector'])
                    break;
                case 11:
                    params.parameters = model['Port']
                    break;
                case 12:
                    params.parameters = `${model['Host']}:${model['Port']}`
                    break;
                default:
                    break;
            }
            if (errMessage) {
                this.goby.showErrorMessage(errMessage)
                throw new Error(errMessage)
            } else {
                return params
            }

        },
        async getpayLoad() {
            let valid = await this.$refs.form[0]?.validate().then(res => res).catch(err => err)
            if (!valid) {
                console.log('表单验证未通过');
                return;
            }
            let params = this.getParams()
            this.loading = true
            this.state = ''
            this.error = ''
            
            if(this.type == 1 && this.parameters?.[this?.currentGadget?.value]?.Category == 'EX-MS' && await this.getPOCParams('classBytes')) {
              params.define_class = true
            }

            if(this.type == 1){
              let yso_options = (await this.getPOCParams('yso_options'))?.value
              console.log(yso_options);
              if(yso_options){
                params.yso_options = yso_options
              }
            }

            getpayLoad({
                method: 'POST',
                body: new URLSearchParams(params).toString()
            }).then(res => res.json()).then(async res => {
                if (res.statusCode == 200) {

                    switch (this.type) {
                        case '1':
                            let info = {}
                            let serializedData = (await this.getPOCParams('serializedData'))?.name
                            serializedData && (info[serializedData] = res.data.payload)

                            if ((this.currentGadget.type == 5 || this.currentGadget.type == 7 || this.currentGadget.type == 13) && this.parameters?.[this.currentGadget.value]?.['Category'] == 'EX-MS') {
                                
                                let url = (await this.getPOCParams('URL'))?.name
                                let password = (await this.getPOCParams('password'))?.name
                                let referer = (await this.getPOCParams('referer'))?.name
                                let classBytes = (await this.getPOCParams('classBytes'))?.name
                                
                                url && (info[url] = this.parameters[this.currentGadget.value].URL)
                                password && (info[password] = this.parameters[this.currentGadget.value].PassWord)
                                referer && (info[referer] = this.parameters[this.currentGadget.value].Referer)
                                classBytes && (info[classBytes] = res.data.class_bytes)
                            }
                            this.goby.setCurrentExpInfo({
                                ...info
                            }, res => {
                                if (res.statusCode == 200) {
                                    console.log('生成并回填成功');
                                    this.state = true
                                    this.goby.showSuccessMessage('Success')
                                    this.goby.closeIframeDia()
                                } else {
                                    console.log('回填失败');
                                    this.state = false
                                    this.error = "Backfill failure"
                                    this.goby.showErrorMessage("Backfill failure")
                                }
                            })
                            break;
                        case '2':
                            let { app, dialog } = top.require('@electron/remote')
                            let downPath = app.getPath('downloads')
                            downPath = dialog.showSaveDialogSync({
                                defaultPath: this.path.join(downPath, 'serializedData.ser')
                            })
                            if (downPath) {
                                this.fs.writeFile(downPath, top.Buffer.from(res.data.payload, 'base64'), err => {
                                    if (err) {
                                        this.state = false
                                        this.error = err
                                        this.goby.showErrorMessage(err)
                                        return
                                    }
                                    this.state = true
                                    this.goby.showSuccessMessage('Success')
                                    this.goby.closeIframeDia()
                                })
                            }
                            break;
                        default:
                            break;
                    }

                } else {
                    console.log('生成payload失败');
                    this.state = false
                    this.error = res.messages || "Failed to generate payload"
                    this.goby.showErrorMessage(res.messages || "Failed to generate payload")
                }
            }).catch(err => {
                console.log('请求失败');
                this.state = false
                this.goby.showErrorMessage(err?.message || "Error")
            }).finally(() => {
                this.loading = false
            })
        },
        base64(str) {
            return top.Buffer(str).toString('base64')
        },
        filterMethod(query){
            query = query.toLocaleLowerCase()
            let list = Object.entries(GadgetList).filter(item => {
                let [key, value] = item
                return key.toLocaleLowerCase().split('').filter(v => query.includes(v)).join('').includes(query)
            }).map(item=>item[1])
            this.GadgetLists = list
        },
        async setParams(expparams){
            // 扩展参数设置
            for await (let item of this.Category[-1]){
                let value = expparams.find(v => v?.name?.toLocaleLowerCase() == item?.name?.toLocaleLowerCase())?.selVal
                let values = value
                if(value == undefined){
                    continue;
                }else{
                    switch (item.type) {
                        case 'input':
                            break;
                        case 'select':
                            values = item.select_list.find(v => v?.label?.toLocaleLowerCase() == value?.toLocaleLowerCase())?.value
                            break
                        case 'radio':
                            values = item.radio_list.find(v => v?.label?.toLocaleLowerCase() == value?.toLocaleLowerCase())?.value
                            break;
                        default:
                            break;
                    }
                    await this.setOneParams(this.e_fn.extension, item, 'extension', values, 0)
                }
            }

            // gadget及其下属的参数设置
            let gadget = expparams.find(item => item?.name?.toLocaleLowerCase() == 'Gadget'.toLocaleLowerCase())?.selVal
            if(!this.parameters[gadget] || !gadget) return
            this.gadget = gadget;
            const type = this.GadgetList.find(item => item?.value?.toLocaleLowerCase() == gadget?.toLocaleLowerCase())?.type
            for await (let item of this.Category[type]) {
                let obj = expparams.find(v => v?.name?.toLocaleLowerCase() == item?.name?.toLocaleLowerCase())
                let value = obj?.selVal
                let values = value
                switch (item.type) {
                    case 'input':
                        break;
                    case 'select':
                        values = item.select_list.find(v => v?.label?.toLocaleLowerCase() == value?.toLocaleLowerCase())?.value
                        break
                    default:
                        break;
                }
                // 为了以后兼容异步设置值, 改为await
                if(item.name.toLocaleLowerCase() == 'url' && obj.value == ""){
                    values = '/' + Date.now().toString(16).split('').sort(()=>Math.random()-0.5).join('') + Math.ceil(Math.random() * 20)
                }
                await this.setOneParams(this.parameters[gadget], item, gadget, values, 1)
            }
            
            
        },
        setOneParams(item, value, gadget, values, type){
            return new Promise(resolve => {
                if(this.isShow(item, value)){
                    if(type == 0){
                        this.$set(this.e_fn.extension, value.name, values)
                    }else if(type == 1){
                        this.$set(this.parameters[gadget], value.name, values)
                    }
                    resolve() 
                }else{
                    resolve()
                }
                
            })
        },
        getPOCParams(key){
          return new Promise(resolve => {
            if(this.type != 1){
                resolve(null)
                return
            }
            this.goby.getCurrentExpInfo(res => {
                res.statusCode == 200 && (() => {
                    resolve((res.data.expparams || []).find(item => {
                      return item.name.toLocaleLowerCase() == key.toLocaleLowerCase()
                    }))
                })()
            })
          }) 
        }
    },
    computed: {
        currentGadget() {
            return GadgetList[this.gadget]
        },
        rules() {
            return Category[GadgetList[this.gadget]?.type]?.reduce((total, prev,) => {
                return {
                    ...total,
                    [prev.name]: [
                        {
                            required: prev.require,
                            trigger: 'blur'
                        }
                    ]
                }
            }, {})
        }
    },
    mounted() {
        this.init()
    }
})