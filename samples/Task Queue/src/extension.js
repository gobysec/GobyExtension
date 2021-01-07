function activate(content) {
	
	class taskQueue {
		constructor(){
			this.fs = require('fs');
			this.path = require('path');
			this.version = require(this.path.join(__dirname,'../','package.json')).version;
			this.filePath = this.path.join(__dirname,'./assets/data.json');
			this.timed=null; //计时器
			this.timeNode = null; //定时时间点
			this.isTargetTime = false; //是否到达定时时间点并且已经开始开始扫描定时任务
			this.isImmediately = this.getQueue().isImmediatelyScan; //到达定时时间后是否立即开始扫描定时任务
		}
		changeTime(timeNode=""){
			return new Promise((resolve,reject)=>{
				let queue = this.getQueue();
				queue.timeNode = timeNode;
				this.timeNode = timeNode;
				fs.writeFile(this.filePath,JSON.stringify(queue , null, 6),(err)=>{
					if(err){
						reject();
					}else{
						if(timeNode){
							clearInterval(this.timed);
							this.timed = setInterval(()=>{
								let  queue = this.getQueue();
								
								if(!this.timeNode) return;
								if(new Date().getTime() >= new Date(this.timeNode).getTime()){
									
									if(queue.data.filter(v=>v.isTimeNode ==1 && v.state == 2).length==0) return;
									
									if(this.isImmediately){//到达定时时间后立即开始扫描定时任务

										if(!this.isTargetTime){
											if(goby.getScanState().state!=3){
												this.stopScan().then(()=>{
													this.isTargetTime = true;
												}).catch((err)=>{
													console.log(err);
												})
											}
											
										}
									}else{//到达定时时间后不立即开始扫描定时任务
										if(goby.getScanState().state != 1 && goby.getScanState().state != 3){
											if(!this.isTargetTime){
												if(queue.data.filter(v=>v.isTimeNode == 1 && v.state == 2).length>0 && queue.data.filter(v=>v.isTimeNode == 1 && v.state == 1).length==0){
													this.startScan(queue.data.filter(v=>v.isTimeNode == 1 && v.state == 2)[0].id).then((res)=>{
														this.isTargetTime = true;
														console.log('成功');
													}).catch(()=>{
														console.log('失败');
													})
												}
											}
												
										}
											
									}
									
								}
							},1000)
						}else{
							clearInterval(this.timed);
							this.isTargetTime = false;
							this.timed = null;
						}
						this.timeNode = this.getQueue().timeNode;
						resolve();
					}
				})
			})
		}
		init(){
			fs.writeFile(this.filePath,JSON.stringify({"data":[],"timeNode":"","isImmediatelyScan":true}, null, 6),(err)=>{
				if(err){
					this.init();
				}else{
					
				}
			})
		}
		getQueue(){
			delete require.cache[require.resolve(this.filePath)];
			return require(this.filePath);
		}
		add(task){
			return new Promise((resolve,reject)=>{
				let queue = this.getQueue();
				task.id = new Date().getTime().toString(16);
				task.state = 2;
				// if(goby.getScanState().state!=1 && goby.getScanState().state!=3){
				// 	console.log(goby.getScanState());
				// 	let index = queue.data.findIndex(v=>!v.taskId);
				// 	if(index!=-1){
				// 		queue.data.splice(index,0,task);
				// 	}else{
				// 		queue.data.push(task);
				// 	}
				// }else{
					// switch (task.isTimeNode) {
					// 	case "0":
					// 		let index = queue.data.findIndex(v=>v.isTimeNode=='1');
					// 		if(index!=-1){
					// 			queue.data.splice(index,0,task);
					// 		}else{
					// 			queue.data.push(task);
					// 		}
					// 		break;
					// 	case "1":
					// 		queue.data.push(task);
					// 		break;
					// 	default:
					// 		break;
					// }
					queue.data.push(task);
					queue.data.sort((num1,num2)=>{
						return num1.isTimeNode - num2.isTimeNode;
					})
					
				// }

				// queue.data.sort((num1,num2)=>{
				// 	return new Date(num1.timenode).getTime()-new Date(num2.timenode).getTime()
				// });
				fs.writeFile(this.filePath,JSON.stringify(queue, null, 6),(err)=>{
					if(err){
						reject(err);
					}else{
						resolve();
						
						let queue = this.getQueue();
						let normal = queue.data.filter(v=>v.isTimeNode == 0 && v.state==2);//正常
						if(!this.timed && !this.isTargetTime && goby.getScanState().state!=1 && goby.getScanState().state!=3 && normal.length==1 && task.isTimeNode=='0'){
							this.firstScan();
						}
						
						// if(goby.getScanState().state!=1 && goby.getScanState().state!=3){
						// 	if(this.getQueue().data.length>0){
						// 		this.startScan(task.id);
						// 	}
						// }
					}
				})
			})
		}
		delete(ids){
			return new Promise((resolve,reject)=>{
				let queue = this.getQueue();
				Promise.all(ids.map((v,k)=>{
					return new Promise((resolve1,reject1)=>{
						let index = queue.data.findIndex((value,key)=>{
							return value.id == v;
						})
						if(index!=-1){
							queue.data.splice(index,1);
							
						}
						resolve1();
					})
				})).then(()=>{
					queue.data.sort((num1,num2)=>{
						return num1.isTimeNode - num2.isTimeNode;
					})
					fs.writeFile(this.filePath,JSON.stringify(queue, null, 6),(err)=>{
						if(err){
							reject(err);
						}else{
							resolve();
						}
					})
				})
			})
				
		}
		change(task){
			return new Promise((resolve,reject)=>{
				let queue = this.getQueue();
				let index = queue.data.findIndex((value,key)=>{
					return value.id == task.id;
				})
				if(index!=-1){
					queue.data[index] = task;
					queue.data.sort((num1,num2)=>{
						return num1.isTimeNode - num2.isTimeNode;
					})
					
					fs.writeFile(this.filePath,JSON.stringify(queue, null, 6),(err)=>{
						if(err){
							reject(err);
						}else{
							resolve();
							this.firstScan();
						}
					})
				}else{
					reject();
				}
			})
		}
		startScan(id){
			return new Promise((resolve,reject)=>{
				let queue = this.getQueue();
				let index = queue.data.findIndex((value,key)=>{
					return value.id == id;
				})
				if(index!=-1){
					goby.startScan(queue.data[index]).then((res)=>{

						queue.data[index].taskId = res.data.taskId;
						queue.data[index].state = 1;
						queue.data.sort((num1,num2)=>{
							return num1.isTimeNode - num2.isTimeNode;
						})
						fs.writeFile(this.filePath,JSON.stringify(queue, null, 6),(err)=>{
							if(err){
								reject(err);
							}else{
								resolve(res);
							}
						})
					});
				}else{
					reject();
				}
			})
		}
		stopScan(){
			return new Promise((resolve,reject)=>{
				goby.stopScan().then((res)=>{
					resolve(res);
				}).catch((err)=>{
					reject(err);
				})
			})
		}
		sort(arr){
			return new Promise((resolve,reject)=>{
				let queue = this.getQueue();
				queue.data=arr.map((v,k)=>{
					return queue.data.filter((value,key)=>{
						return v==value.id;
					})[0];
				}).sort((a,b)=>{
					return a.state - b.state;
				})
				queue.data.sort((num1,num2)=>{
					return num1.isTimeNode - num2.isTimeNode;
				})
				this.fs.writeFile(this.filePath,JSON.stringify(queue, null, 6),(err)=>{
					if(err){
						reject();
					}else{
						resolve();
						this.firstScan()
					}
				})
			})
				
		}
		firstScan(){
			let queue = this.getQueue();
			let normal = queue.data.filter(v=>v.isTimeNode == 0 && v.state==2);//正常
			let scaning = queue.data.filter(v=>v.isTimeNode == 0 && v.state==1);//扫描中
			if(!this.timed && !this.isTargetTime && goby.getScanState().state!=1 && goby.getScanState().state!=3 && normal.length>0 && scaning.length == 0){
				this.startScan(normal[0].id)
			}
		}
	}
	if(window.taskQueue){
		let path = require('path');
		require.cache[require.resolve(path.join(__dirname,'../','package.json'))]
		if(compareVersion(window.taskQueue.version,require(path.join(__dirname,'../','package.json')).version)=='-1'){
			clearInterval(window.taskQueue.timed);
			delete window.taskQueue;
			
			window.taskQueue = new taskQueue();
			window.taskQueue.init();
		}
	}else{
		window.taskQueue = new taskQueue();
		window.taskQueue.init();
	}
	
	
	goby.registerCommand('addTask', function (content) {
		let path = require('path');
		let url = path.join(__dirname,'./assets/taskQueue.html');
		goby.showIframeDia(url,'Task Queue',666,600);
	});	
	goby.bindEvent('onEndScan',(res)=>{
		let queue = window.taskQueue.getQueue();
		let clear = queue.data.filter((v,k)=>{
			return v.taskId && v.taskId == res.taskId;
		});
		if(clear.length>0){
			window.taskQueue.change({
				...clear[0],
				state:0,
			}).then(()=>{
				let queue = window.taskQueue.getQueue();
				let normal = queue.data.filter(v=>v.isTimeNode == 0 && v.state==2);//正常
				let timeing = queue.data.filter(v=>v.isTimeNode == 1 && v.state==2);//定时
				if(timeing.length==0){
					window.taskQueue.isTargetTime = false;
				}
				if((!window.taskQueue.isTargetTime && !window.taskQueue.timed && normal.length>0) || (timeing.length==0 && normal.length>0)){
					window.taskQueue.startScan(normal[0].id).then((result)=>{
						
						window.taskQueue.change({
							...normal[0],
							taskId:result.data.taskId,
							state:1
						}).then(()=>{
							console.log('修改成功');
						})
						console.log('开启下一个成功');
					});
				}

				if(window.taskQueue.isTargetTime  && window.taskQueue.timeNode && (new Date().getTime() >= new Date(window.taskQueue.timeNode).getTime()) && timeing.length>0){
					
					window.taskQueue.startScan(timeing[0].id).then((result)=>{
						window.taskQueue.change({
							...timeing[0],
							taskId:result.data.taskId,
							state:1
						}).then(()=>{
							window.taskQueue.isTargetTime = true;
							console.log('修改成功');
						})
						console.log('开启下一个成功');
					});
				}
				
			});
		}else{
			let queue = window.taskQueue.getQueue();
			let normal = queue.data.filter(v=>v.isTimeNode == 0 && v.state==2);//正常
			let timeing = queue.data.filter(v=>v.isTimeNode == 1 && v.state==2);//定时
			if(timeing.length==0){
				window.taskQueue.isTargetTime = false;
			}
			if((!window.taskQueue.isTargetTime && !window.taskQueue.timed && normal.length>0) || (timeing.length == 0 && normal.length>0)){
				window.taskQueue.startScan(normal[0].id).then((result)=>{
					window.taskQueue.change({
						...normal[0],
						taskId:result.data.taskId,
						state:1
					}).then(()=>{
						console.log('修改成功');
					})
					console.log('开启下一个成功');
				});
			}
			if(window.taskQueue.isTargetTime  && window.taskQueue.timeNode && (new Date().getTime() >= new Date(window.taskQueue.timeNode).getTime()) && timeing.length>0){
				window.taskQueue.startScan(timeing[0].id).then((result)=>{
					window.taskQueue.change({
						...timeing[0],
						taskId:result.data.taskId,
						state:1
					}).then(()=>{
						window.taskQueue.isTargetTime = true;
						console.log('修改成功');
					})
					console.log('开启下一个成功');
				});
			}
				
		}
	})
	
	goby.bindEvent('onPauseScan',(res)=>{
		let queue = window.taskQueue.getQueue();
		let removes = queue.data.filter(v=>v.taskId==res.taskId);
		window.taskQueue.delete(removes.map(v=>v.id)).then(()=>{
			let timeing = queue.data.filter(v=>v.isTimeNode == 1 && v.state==2);//定时
			if(window.taskQueue.isTargetTime  && window.taskQueue.timeNode && (new Date().getTime() >= new Date(window.taskQueue.timeNode).getTime()) && timeing.length>0){
				window.taskQueue.startScan(timeing[0].id).then((result)=>{
					window.taskQueue.change({
						...timeing[0],
						taskId:result.data.taskId,
						state:1
					}).then(()=>{
						window.taskQueue.isTargetTime = true;
						console.log('修改成功');
					})
					console.log('开启下一个成功');
				});
			}
		}).catch((err)=>{
			console.log(err);
			console.log('暂停后删除失败');
		});
	})

	function compareVersion(v1,v2){
		if(!v1 || !v2){
			return -1;
		}
		v1 = v1.split('.')
		v2 = v2.split('.')
		const len = Math.max(v1.length, v2.length)
		
		while (v1.length < len) {
			v1.push('0')
		}
		while (v2.length < len) {
			v2.push('0')
		}
		
		for (let i = 0; i < len; i++) {
			const num1 = parseInt(v1[i])
			const num2 = parseInt(v2[i])
		
			if (num1 > num2) {
			
			return 1
			} else if (num1 < num2) {
			
			return -1
			}
		}
		
		return 0
	}

}
exports.activate = activate;
