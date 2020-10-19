<template>
	<div>
		<el-dialog title="调度任务" :visible.sync="value" :show-close="false" :center="true" :destroy-on-close="true">
			<el-form ref="form" :model="data" label-width="120px" :rules="rules">
			  <el-form-item label="任务名称" prop="jobName">
				<el-input v-model="data.jobName" placeholder="请输入任务名称"></el-input>
			  </el-form-item>
			  <el-form-item label="任务分组" prop="jobGroup">
				  <el-input v-model="data.jobGroup" placeholder="请输入任务组名"></el-input>
			  </el-form-item>
			  <el-form-item label="执行类" prop="jobClassName">
				  <el-select v-model="data.jobClassName" clearable placeholder="请选择执行类" style="width: 780px;">
					  <el-option :key="item" :label="item" :value="item" v-for="item in jobClassList"></el-option>
				  </el-select>
			  </el-form-item>
			  <el-form-item label="cron表达式" prop="cronExpression">
				  <el-input type="text" v-model="data.cronExpression" placeholder="请输入CRON表达式">
					  <template slot="append">
						 <!-- <el-link type="danger" href="http://qqe2.com/cron" target="_blank">查看cron表达式</el-link> -->
						  <a href="http://qqe2.com/cron" target="_blank" style="text-decoration:none">查看cron表达式</a>
					  </template>
				  </el-input>
			  </el-form-item>
			  <el-form-item label="任务描述" prop="description">
				 <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入任务描述" v-model="data.description">
				 </el-input>
			  </el-form-item>
			</el-form>
			<template slot="footer" class="dialog-footer">
				<el-button @click="value = false">取 消</el-button>
				<el-button type="primary" @click="handleSubmit">确 定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script>
	
	import { getClassesList,isExist,add } from '../../../api/system/quartz.js'
	
	export default {
		name:'quartz-window',
		data(){
			return {
				value : false,
				data:{},
				jobClassList:[]
			}
		},
		watch:{
			value(data){
				if(data){
					getClassesList().then(res=>{
						this.jobClassList = res.data;
					});
				}
			}
		},
		computed:{
			rules(){
				return {
						jobName:[
							{required:true,message:'必填项',trigger:'blur'}
						],
						jobGroup:[
							{required:true,message:'必填项',trigger:'blur'}
						],
						jobClassName:[
							{required:true,message:'必填项',trigger:'change'}
						],
						cronExpression:[
							{required:true,message:'必填项',trigger:'blur'}
						],
						description:[
							{required:true,message:'必填项',trigger:'blur'}
						]
				}
			}
		},
		methods:{
			handleSubmit(){
				this.$refs['form'].validate(valid=>{
					if(valid){
						
						isExist({jobName:this.data.jobName,jobClassName:this.data.jobClassName}).then(res=>{
							if(res.data.code == 500){
								this.$message({
									message:res.data.msg,
									type:'warning'
								});
								return false;
							}else if(res.data.code == 200){
								add(this.data).then(res=>{
									this.$message({
										message:res.data.msg,
										type: res.data.code == 200 ? 'success':'error'
									});
									this.value = false;
									this.data = {};
									this.$parent.list(this.$parent.params);
								});
							}
							
						});
						
					}else{
						return false;
					}
				});
			}
		}
	}
</script>

<style>
</style>
