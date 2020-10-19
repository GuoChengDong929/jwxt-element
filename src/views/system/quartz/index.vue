<template>
    <div>
		<el-card>
			<el-button type="primary" @click="openWindow(null,'quartzWindow')"> <span class="el-icon-circle-plus"></span> 新增调度</el-button>
		</el-card>
		<el-card>
			<el-table :data="data" stripe>
				<el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
				<el-table-column label="任务名称" prop="jobName" align="center"></el-table-column>
				<el-table-column label="任务分组" prop="jobGroup" align="center"></el-table-column>
				<el-table-column label="执行类" prop="jobClassName" align="center"></el-table-column>
				<el-table-column label="cron表达式" prop="cronExpression" align="center"></el-table-column>
				<el-table-column label="触发器状态" prop="triggerState" align="center"></el-table-column>
				<el-table-column label="描述" prop="description" align="center"></el-table-column>
				<el-table-column label="操作" align="center" width="350px">
					<template slot-scope="scope" >
						<el-button type="primary" size="small" @click="trigger(scope.row)"><span class="el-icon-message-solid"></span>触发</el-button>
						<el-button type="primary" size="small" @click="pause(scope.row)"><span class="el-icon-message-solid"></span>暂停</el-button>
						<el-button type="primary" size="small" @click="resume(scope.row)"><span class="el-icon-success"></span> 恢复</el-button>
						<el-button type="primary" size="small" @click="remove(scope.row)"><span class="el-icon-error"></span> 结束</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background
			 layout="prev,pager,next" 
			 :total="params.total" 
			 :page-size="params.size" 
			 :current-page="params.page" 
			 :hide-on-single-page="true"
			 @size-change="handleSizeChange"
			 @current-change="handlePageChange"></el-pagination>
		</el-card>
		
		<quartz-window ref="quartzWindow"></quartz-window>
		
	</div>
</template>

<script>
	
	import { getQuartzList,trigger,pause,resume,remove } from '../../../../src/api/system/quartz.js'
	
    export default {
        name: "index",
		components:{
			QuartzWindow:()=> import("@/views/system/quartz/quartz-window.vue")
		},
		data(){
			return {
				data:[],
				params:{page:1,size:2,total:0}
			}
		},
		methods:{
			list(data){
				getQuartzList(data).then(res=>{
					this.params.total = res.data.total;
					this.data = res.data.rows;
				});
			},
			handleSizeChange(val){
				this.params.size = val;
				this.list(this.params);
			},
			handlePageChange(val){
				this.params.page = val;
				this.list(this.params);
			},
			openWindow(data,name){
				if(data == null){
					this.$refs[name].data = {};
					this.$refs[name].value = true;
				}
			},
			trigger(data){
				
				/* if(data.triggerState == 'RUNNING'){
					this.$message({
						message:'正在执行的任务无法触发',
						type:'warning'
					});
					return false;
				} */
				
				trigger({jobName:data.jobName,jobGroup:data.jobGroup}).then(res=>{
					this.$message({
						message:res.data.msg,
						type:res.data.code == 200 ? 'success' : 'error'
					});
					this.list(this.params);
				});
			},
			pause(data){
				if(data.triggerState == "PAUSED"){
					this.$message({
						message:'暂停的任务无需再次暂停!!!',
						type:'warning'
					});
					return false;
				}else{
					this.$confirm("确定要暂停该任务吗?","友情提示",{type:'warning'}).then(()=>{
						pause({jobName:data.jobName,jobGroup:data.jobGroup}).then(res=>{
							this.$message({
								message:res.data.msg,
								type:res.data.code == 200 ? 'success' : 'error'
							});
							this.list(this.params);
						});
					});
				}
			},
			resume(data){
				if(data.triggerState != "PAUSED"){
					this.$message({
						message:'只能恢复已经暂停的任务',
						type:'warning'
					});
					return false;
				}else{
					this.$confirm("确定要恢复已暂停的任务吗?","友情提示",{type:'warning'}).then(()=>{
						resume({jobName:data.jobName,jobGroup:data.jobGroup}).then(res=>{
							this.$message({
								message:res.data.msg,
								type:res.data.code == 200 ? 'success' : 'error'
							});
							this.list(this.params);
						});
					});
				}
			},
			remove(data){
				this.$confirm("确定要删除吗?","友情提示",{type:'warning'}).then(()=>{
					remove({jobName:data.jobName,jobGroup:data.jobGroup}).then(res=>{
						this.$message({
							message:res.data.msg,
							type:res.data.code == 200 ? 'success' : 'error'
						});
						this.list(this.params);
					});
				});
			}
		},
		created(){
			this.list(this.params);
		}
    }
</script>

<style scoped>

</style>