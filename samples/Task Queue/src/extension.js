function activate(content) {
	
	class taskQueue {
		constructor(){
			this.fs = require('fs');
			this.path = require('path');
			this.filePath = this.path.join(__dirname,'./assets/data.json');
			fs.writeFile(this.filePath,JSON.stringify({"data":[]}, null, 6),(err)=>{
				if(err){
					
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
				if(goby.getScanState().state!=1 && goby.getScanState().state!=3){
					console.log(goby.getScanState());
					let index = queue.data.findIndex(v=>!v.taskId);
					if(index!=-1){
						queue.data.splice(index,0,task);
					}else{
						queue.data.push(task);
					}
				}else{
					queue.data.push(task);
				}
				
				fs.writeFile(this.filePath,JSON.stringify(queue, null, 6),(err)=>{
					if(err){
						reject(err);
					}else{
						resolve();
						
						if(this.getQueue().data.length>0){
							this.startScan(task.id);
						}
						
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
					fs.writeFile(this.filePath,JSON.stringify(queue, null, 6),(err)=>{
						if(err){
							reject(err);
						}else{
							resolve();
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
	}
	if(!window.taskQueue){
		window.taskQueue = new taskQueue();
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
				if(queue.data.length>1){
					window.taskQueue.startScan(queue.data.filter(v=>v.state==2)[0].id).then((result)=>{
						window.taskQueue.change({
							...queue.data[1],
							taskId:result.data.taskId,
							state:1
						}).then(()=>{
							console.log('修改成功');
						})
						console.log('开启下一个成功');
					});
				}
			});
		}else{
			let queue = window.taskQueue.getQueue();
			if(queue.data.length>0){
				window.taskQueue.startScan(queue.data.filter(v=>v.state==2)[0].id).then((result)=>{
					window.taskQueue.change({
						...queue.data[0],
						taskId:result.data.taskId,
						state:1
					}).then(()=>{
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
		window.taskQueue.delete(removes.map(v=>v.id));
	})
}
exports.activate = activate;
