<template>
	<div class="login-container">
		<div class="login-from">
			<h3 class="login-title">教务平台</h3>
			<el-form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit('loginForm')">
				<div style="padding:4px 0px;"></div>
				<el-input placeholder="请输入账号" prefix-icon="el-icon-user-solid" v-model="form.username"></el-input>
				<div style="padding:10px 0px;"></div>
				<el-input placeholder="请输入密码" type="text"  prefix-icon="el-icon-s-goods" v-model="form.password"  v-if="visible">
					<i slot="suffix" @click="changePass(true)" class="iconFamily myiconeye" style="line-height: 51px;"></i>
				</el-input>
				<el-input placeholder="请输入密码" type="password" prefix-icon="el-icon-s-goods" v-model="form.password"  v-else>
					<i slot="suffix" @click="changePass(false)" class="iconFamily myiconeye-close-line" style="line-height: 51px;"></i>
				</el-input>
				<div style="padding:10px 0px;"></div>
			</el-form>

			
			<el-button type="primary" style="width: 100%;"  @click="handleSubmit('loginForm')" >登录	</el-button>
			<div style="text-align: center;margin-top: 20px">
				<a  style="color: white" href="#" @click="updatePassword">忘记密码?</a>
			</div>
		</div>

		<!-- <update-password ref="updatePassword"></update-password> -->
	</div>
</template>

<script>
//import { mapActions } from 'vuex'
import { mapActions } from 'vuex'
export default {
	name: 'login',
	// components: {
	// 	UpdatePassword:()=>import("@/components/login/update-password.vue")
	// },
	props:{
		usernameRules:{
			type:Array,
			default:()=>{
				return [
					{required:true,message:"必填项",trigger:'blur'}
				]
			}
		},
		passwordRules:{
			type: Array,
			default:()=>{
				return [
					{required: true,message:'必填项',trigger: "blur"}
				]
			}
		}
	},
	data() {
		return {
			form:{username:'',password:''},
			visible: false
			
		};
	},
	methods: {
		...mapActions([
			'handleLogin',
			'getUserInfo'
		]),
		changePass(val){
			this.visible=!val;
		},
		handleSubmit(name){
			this.$refs[name].validate(valid=>{
				if(valid){
					this.handleLogin(this.form).then(res=>{  //如果执行成功则设置token(store/user.js)
						this.getUserInfo().then(res=>{  //如果查询用户信息成功 则设置access(store/user.js)
							this.$router.push({ //开始路由跳转到首页
								name : this.$config.homeName
							});
						})
					})
				}else{
					return false;
				}
			});
		},
		updatePassword(){
			this.$refs['updatePassword'].params = {};
			this.$refs['updatePassword'].value = true;
		}
	},
	computed: {
		rules(){
			return {
				username : this.usernameRules,
				password : this.passwordRules
			}
		}
	}
};
</script>

<style>
.login-container {
	min-height: 100%;
	width: 100%;
	height: 100vh;
	background-color: #2d3a4b;
	overflow: hidden;
}
.login-title {
	font-size: 26px;
	color: #eee;
	margin: 0px auto 20px auto;
	text-align: center;
	font-weight: bold;
}
.login-from {
	position: relative;
	width:440px;
	max-width: 100%;
	padding: 300px 35px 0;
	margin: 0 auto;
	overflow: hidden;
	
}

.el-input--prefix .el-input__inner{
	border: 1px solid rgba(255,255,255,0.1);
	background: rgba(0,0,0,0.1);
	border-radius: 5px;
	height: 51px;
	line-height: 36px;
	font-size: 14px;
	color: #FFFFFF;
}
</style>
