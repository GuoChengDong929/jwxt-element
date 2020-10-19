<template>
	<div>
		<el-dialog title="章节页面" style="background: #F0F0F0" :close-on-click-modal="false" :close-on-press-escape="false"  :visible.sync="value" :show-close="false" :center="true">
			<el-form ref="form" :model="data" :rules="rules" label-position="right" label-width="80px">
				<el-form-item prop="name" label="章节名称">
					<el-input v-model="data.name" placeholder="请输入章节名称"></el-input>
				</el-form-item>
				<el-form-item prop="sortNumber" label="章节排序">
					<el-input v-model="data.sortNumber" placeholder="请输入章节排序"></el-input>
				</el-form-item>
			</el-form>

			<template slot="footer">
				<el-button type="info" @click="value = false" plain> <span class="el-icon-bell"></span> 取消</el-button>
				<el-button type="success" @click="handleSubmit" plain><span class="el-icon-loading"></span>提交</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script>


	import { saveOrUpdate } from "@/api/academic/chapter";

	export default {
		name: 'chapter-child',
		data(){
			return {
				value:false,
				data:{}
			}
		},
		props:{
			nameRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:"必填项",trigger:'blur'}
					]
				}
			},
			sortNumberRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:"必填项",trigger:'blur'}
					]
				}
			}
		},
		computed:{
			rules(){
				return {
					name:this.nameRule,
					sortNumber:this.sortNumberRule
				}
			}
		},
		methods:{
			handleSubmit(){
				if(!this.data.curriculumId){
					this.$message.error("请选择课程后再添加章节");
					return false;
				}

				this.$refs['form'].validate(valid=>{
					if(valid){
						saveOrUpdate(this.data).then(res=>{
							this.$message({
								type:res.data.success ? 'success' : 'error',
								message:res.data.message
							});
							this.value = false;
							this.$parent.getChapters({id:this.data.curriculumId});
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
