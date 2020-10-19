<template>
    <div>
        <el-dialog title="学生页面" style="background: #F0F0F0;" :close-on-click-modal="false" :close-on-press-escape="false"  :visible.sync="value" :show-close="false" :center="true">
            <el-form ref="form" :model="student" fullscreen inline :rules="rules" label-position="right" label-width="120px" size="mini">
                <el-form-item prop="nickName" label="用户姓名">
					<el-input type="text" v-model="student.nickName" placeholder="请输入用户姓名"></el-input>
				</el-form-item>
                <el-form-item prop="telephone" label="电话号码">
					<el-input type="text" v-model="student.telephone" placeholder="请输入电话号码"></el-input>
				</el-form-item>
                <el-form-item prop="email" label="用户邮箱">
					<el-input type="text" v-model="student.email" placeholder="请输入E-mail"></el-input>
				</el-form-item>

				<el-form-item prop="sex" label="用户性别">
					<el-radio-group v-model="student.sex">
						<el-radio :label="'1'">男</el-radio>
						<el-radio :label="'2'">女</el-radio>
					</el-radio-group>
				</el-form-item>

                <el-form-item prop="residenceAddress" label="户籍住址">
					<el-input type="text" v-model="student.residenceAddress" placeholder="请输入户籍地址"></el-input>
				</el-form-item>
				<el-form-item prop="nowAddress" label="现居住址">
					<el-input type="text" v-model="student.nowAddress" placeholder="请输入现居地址"></el-input>
				</el-form-item>
				
				<el-form-item prop="type" label="用户类型">
					<el-radio-group v-model="student.type">
						<el-radio :label="'1'" disabled>教师</el-radio>
						<el-radio :label="'2'">学生</el-radio>
					</el-radio-group>
				</el-form-item>

                <el-form-item prop="idCard" label="身份证号">
					<el-input type="text" v-model="student.idCard" placeholder="请输入身份证号"></el-input>
				</el-form-item>

				<el-form-item prop="birthday" label="用户生日">
					<el-date-picker v-model="student.birthday" type="datetime" placeholder="选择日期" size="mini"></el-date-picker>
				</el-form-item>

                <el-form-item prop="education" label="用户学历">
					<el-select v-model="student.education" clearable filterable placeholder="请选择学历">
                        <el-option value="1" label="初中"></el-option>
                        <el-option value="2" label="高中"></el-option>
						<el-option value="3" label="中专"></el-option>
						<el-option value="4" label="大专"></el-option>
						<el-option value="5" label="本科"></el-option>
					</el-select>

				</el-form-item>

				<el-form-item prop="graduationSchool" label="毕业院校">
					<el-input type="text" v-model="student.graduationSchool" placeholder="请输入毕业院校"></el-input>
				</el-form-item>

				<el-form-item prop="major" label="用户专业">
					<el-radio-group v-model="student.major">
						<el-radio :label="'1'">计算机专业</el-radio>
						<el-radio :label="'2'">其他专业</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item prop="emergencyContact" label="紧急联系">
					<el-input type="text" v-model="student.emergencyContact" placeholder="请输入紧急联系人"></el-input>
				</el-form-item>

				<el-form-item prop="relation" label="姓名电话">
					<el-input type="text" v-model="student.relation" placeholder="请输入紧急联系人姓名和电话"></el-input>
				</el-form-item>
                
                <el-form-item prop="classesId" label="所在班级">
                    <el-select v-model="student.classesId" clearable collapse-tags filterable>
                        <el-option :key="item.id" :value="item.id" :label="item.classesName" v-for="item in classesData"></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item prop="checkRoleList" label="分配角色">
					<el-checkbox-group v-model="checkRoleList">
					    <el-checkbox :key="item.id" :label="item.id" v-for="item in roleData">{{item.name}}</el-checkbox>
					  </el-checkbox-group>
				</el-form-item>

            </el-form>

            <template slot="footer">
                <el-button type="info" plain @click="value = false"><span class="el-icon-bell"></span>取消</el-button>
                <el-button type="success" plain @click="handleSubmit"><span class="el-icon-loading"></span>提交</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>

    import { getRoles } from '@/api/access/role.js'

    import { findAll } from '@/api/quality/transact/classes.js'

    import { saveOrUpdate } from '@/api/quality/student/student.js'

    export default {
        name:'student-child',
        data(){
            return {
                value : false,
                student : {},
                roleData:[],
                classesData:[],
                checkRoleList:[]
            }
        },
        props:{
           	nickNameRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:'必填项',trigger:'blur'}
					]
				}
			},
			telephoneRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:'必填项',trigger:'blur'}
					]
				}
			},
			emailRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:'必填项',trigger:'blur'}
					]
				}
			},
			sexRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:'必选项',trigger:'change'}
					]
				}
			},
			residenceAddressRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:'必填项',trigger:'blur'}
					]
				}
			},
			nowAddressRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:'必填项',trigger:'blur'}
					]
				}
			},
			typeRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:'必选项',trigger:'change'}
					]
				}
			},
			idCardRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:'必填项',trigger:'blur'}
					]
				}
			},
			birthdayRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:'必选项',trigger:'change'}
					]
				}
			},
			graduationSchoolRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:'必填项',trigger:'blur'}
					]
				}
			},
			majorRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:'必选项',trigger:'change'}
					]
				}
			},
            emergencyContactRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:'必填项',trigger:'blur'}
					]
				}
			},
			relationRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:'必填项',trigger:'blur'}
					]
				}
            },
            educationRule:{
				type:Array,
				default:()=>{
					return [
						{required:true,message:'必选项',trigger:'change'}
					]
				}
            },
            classesIdRule:{
                type:Array,
				default:()=>{
					return [
						{required:true,message:'必选项',trigger:'change'}
					]
				}   
            }
        },
        computed:{
            rules(){
                return {
                    nickName:this.nickNameRule,
					telephone: this.telephoneRule,
					email: this.emailRule,
					sex: this.sexRule,
					residenceAddress: this.residenceAddressRule,
					nowAddress: this.nowAddressRule,
					type: this.typeRule,
					idCard: this.idCardRule,
					birthday:this.birthdayRule,
					graduationSchool:this.graduationSchoolRule,
					major:this.majorRule,
					emergencyContact:this.emergencyContactRule,
                    relation:this.relationRule,
                    education:this.educationRule,
                    classesId:this.classesIdRule
                }
            }
        },
        watch:{
           value(data){
               if(data){
                    getRoles().then(res=>{
						this.roleData = res.data.data;
                    });
                    
                    findAll().then(res=>{
                        this.classesData = res.data.data;
                    });


                    //处理角色多选框的数据回显
					this.checkRoleList = [];
					if(this.student.roles && this.student.roles.length > 0){
						this.student.roles.forEach(role=>{
							this.checkRoleList.push(role.id);
						});
					}
               }
           }        
        },
        methods:{
            handleSubmit(){
                this.$refs['form'].validate(valid=>{
                    if(valid){

                       if(this.checkRoleList.length == 0){
							this.$message.error("请为用户分配角色");
							return false;
						}     

                        this.student.roleIds = this.checkRoleList.join(",");

                        saveOrUpdate(this.student).then(res=>{
							this.$message({
								type:res.data.success?'success':'error',
								message:res.data.message
							});
							this.value = false;

							this.$parent.getStudentList(this.$parent.params); //根据当前用户的departmentId来刷新当前部门的用户列表
						});


                    }else{
                        return false;
                    }
                });
            }
        }
    }
</script>
<style scoped>

</style>