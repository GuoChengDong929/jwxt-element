<template>
	<div>
		<el-dialog title="课程页面" style="background: #F0F0F0;" :close-on-click-modal="false" :close-on-press-escape="false"  :visible.sync="value" :show-close="false" :center="true">
			<el-form ref="form" :model="curriculum" :rules="rules" label-position="right" label-width="80px">
				<el-form-item prop="name" label="课程名称">
					<el-input type="text" v-model="curriculum.name" placeholder="请输入课程名称"></el-input>
				</el-form-item>
				<el-form-item prop="sortNumber" label="排序字段">
					<el-input type="text" v-model="curriculum.sortNumber" placeholder="请输入排序字段,纯数字"></el-input>
				</el-form-item>
				<el-form-item prop="title" label="标题文本">
					<el-input type="text" v-model="curriculum.title" placeholder="刷题专用: 显示标题文本"></el-input>
				</el-form-item>
				<el-form-item prop="description" label="阶段描述">
					<el-input type="text" v-model="curriculum.description" placeholder="刷题专用: 显示阶段描述"></el-input>
				</el-form-item>
				<el-form-item prop="avatar" label="图片地址">
					<el-input type="text" v-model="curriculum.avatar" placeholder="刷题专用: 显示的图片地址"></el-input>
				</el-form-item>
			</el-form>
			
			<template slot="footer">
				<el-button type="info" @click="value = false" plain><span class="el-icon-bell"></span>取消</el-button>
				<el-button type="success" @click="handleSubmit(curriculum)" plain><span class="el-icon-loading"></span>提交</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script>
	
	import { saveOrUpdate } from '@/api/academic/curriculum.js'
	
	export default {
		name: "curriculum-child",
		data(){
			return {
				value : false,
				curriculum:{}
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
			},
			titleRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:"必填项",trigger:'blur'}
					]
				}
			},
			avatarRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:"必填项",trigger:'blur'}
					]
				}
			},
			descriptionRule:{
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
					sortNumber:this.sortNumberRule,
					title:this.titleRule,
					avatar:this.avatarRule,
					description:this.descriptionRule
				}
			}
		},
		methods:{
			handleSubmit(curriculum){
				this.$refs['form'].validate(valid=>{
					if(valid){
						saveOrUpdate(curriculum).then(res=>{
							this.$message({
								type:res.data.success ? 'success' : "error",
								message: res.data.message
							});
							this.value = false;
							this.$parent.findAll();
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
